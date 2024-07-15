<template>
<div v-if="overlay">
    <v-overlay :model-value="overlay" class="align-center justify-center">
        <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
    </v-overlay>
</div>
<div v-else>
    <v-container>
        <v-row>
            <v-col>
                <v-carousel show-arrows="hover" cycle hide-delimiter-background>
                    <v-carousel-item v-for="image in project.images" :key="image.public_id">
                        <v-img :src="image.secure_url" height="150px"></v-img>
                    </v-carousel-item>
                </v-carousel>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h1>{{ project.name }}</h1>
                <h2>Products Used</h2>
                <v-list>
                    <v-list-item v-for="product in project.scheduleService.products" :key="product.product">
                        <v-list-item-title>{{ product.product.product }}</v-list-item-title>
                        <v-list-item-subtitle>{{ product.quantity }}</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
                <h2>Project Description</h2>
                <p>{{ project.description }}</p>
                <h2>Service Type</h2>
                <p>{{ project.service.tipoDeServicio.tipo }}</p>
                <h2>Project Details</h2>
                <p>Start Date: {{ new Date(project.scheduleService.dates.scheduledTime).toLocaleDateString() }}</p>
                <p>End Date: {{ new Date(project.scheduleService.dates.reserved).toLocaleDateString() }}</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-btn color="primary" @click="editProject">Edit Project</v-btn>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" max-width="800px">
            <v-card>
                <v-card-title>
                    <span class="headline">Editar Proyecto Destacado</span>
                </v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="saveChanges">
                        <v-select v-model="form.scheduleService" :items="scheduleServices" item-title="description" item-value="description" label="Servicio Programado" required></v-select>
                        <v-textarea v-model="form.description" label="Descripción" required></v-textarea>
                        <v-file-input ref="fileInput" label="Imágenes" multiple accept="image/*" chips clearable @change="handleImageUpload"></v-file-input>
                        <v-row>
                            <v-col v-for="(image, index) in combinedImages" :key="image.public_id || index" cols="12" sm="6" md="4">
                                <v-img :src="image.secure_url || image" height="150px"></v-img>
                                <v-btn prepend-icon="mdi-delete" color="red-darken-3" variant="text" @click="removeImage(image, index)">
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialog = false">Cancelar</v-btn>
                            <v-btn color="blue darken-1" text type="submit">Guardar Cambios</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</div>
</template>

  
<script>
import {
    api
} from "@/axios/axios.js";
import {
    toast
} from "vue3-toastify";

export default {
    data() {
        return {
            overlay: true,
            project: {},
            scheduleServices: [],
            form: {
                scheduleService: '',
                description: '',
                imageFiles: [],
                images: [],
                publicIdsToRemove: [],
                uploadImages: []
            },
            dialog: false
        };
    },
    computed: {
        combinedImages() {
            return [...this.project.images, ...this.form.images];
        }
    },
    created() {
        const projectId = this.$route.params.id;
        this.fetchProjectData(projectId);
        this.getScheduleServices();
    },
    methods: {
        async fetchProjectData(id) {
            this.overlay = true;
            try {
                const {
                    data
                } = await api.get(`/feature/get/${id}`);
                console.log(data);
                if (data.success) {
                    this.project = data.project;
                    this.form.scheduleService = data.project.scheduleService.description;
                    this.form.description = data.project.description;
                    this.form.uploadImages = data.project.images;
                }
                this.overlay = false;
            } catch (error) {
                console.error("There was an error fetching the project data!", error);
            }
        },
        async getScheduleServices() {
            try {
                const {
                    data
                } = await api.get("/schedule/getServicesByStatus/finish");
                this.scheduleServices = data.services;
            } catch (error) {
                console.error("Error fetching schedule services", error);
            }
        },
        handleImageUpload(event) {
            const files = event.target.files;
            if (!files) return;

            const maxSize = 4 * 1024 * 1024; // 4 MB
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.size > maxSize) {
                    toast.error(`El archivo ${file.name} excede el tamaño máximo permitido.`);
                    continue;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target && e.target.result) {
                        this.form.images.push(e.target.result);
                        // Resetear el input después de cada lectura
                        this.$refs.fileInput.value = "";
                    }
                };
                reader.readAsDataURL(file);
            }
        },
        removeImage(image, index) {
            if (image.public_id) {
                this.form.publicIdsToRemove.push(image.public_id);
                this.project.images = this.project.images.filter(img => img.public_id !== image.public_id);
            } else {
                this.form.images.splice(index - this.project.images.length, 1);
                this.form.imageFiles = this.form.imageFiles.filter((_, i) => i !== index - this.project.images.length);
                this.form.uploadImages = this.form.uploadImages.filter(img => img.public_id !== image.public_id);
                // Limpiar el file input
                this.$refs.fileInput.reset();
            }
        },
        editProject() {
            this.dialog = true;
        },
        async saveChanges() {
            this.dialog = false;
            this.overlay = true;
            const token = localStorage.getItem("token");
            // Implement the save functionality
            console.log(this.form);
            try {
                const {
                    data
                } = await api.put(`/feature/update/${this.project._id}`, this.form, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'rol': 'admin',
                    },
                });
                if (data.success) {
                    toast.success("Proyecto actualizado con éxito");
                    this.form.description = ''
                    this.form.imageFiles = []
                    this.form.images = []
                    this.form.uploadImages = []
                    this.form.scheduleService = ''
                } else {
                    toast.error(data.msg);
                }
                this.fetchProjectData(this.project._id);
            } catch (error) {
                console.error("Error saving changes", error);
            }
        }
    }
};
</script>

  
<style>
/* Add any necessary styling */
</style>
