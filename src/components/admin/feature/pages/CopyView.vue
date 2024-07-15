<template>
    <v-overlay :model-value="overlay" class="align-center justify-center">
        <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
    </v-overlay>
    <v-container>
        <v-card flat>
            <v-card-title>Proyectos Destacados</v-card-title>
            <v-card-text>
                <v-data-table :headers="headers" :items="processedProjects">
                    <template v-slot:item.actions="{ item }">
                        <v-btn variant="text" @click="viewProject(item)" color="green-darken-3" prepend-icon="mdi-eye">
                            Información
                        </v-btn>
                        <v-btn variant="text" @click="deleteProject(item)" color="red-darken-3" prepend-icon="mdi-delete">
                            Eliminar
                        </v-btn>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-btn color="green-darken-3" block @click="openAddDialog">Agregar Proyecto</v-btn>
    
        <v-dialog v-model="projectDialog" width="800">
            <v-card>
                <v-card-title>{{ "Agregar Proyecto" }}</v-card-title>
                <v-card-text>
                    <v-form ref="projectForm">
                        <v-select v-model="form.scheduleService" :items="scheduleServices" item-title="description" item-value="description" label="Servicio Programado" required></v-select>
                        <v-text-field v-model="form.description" label="Descripción" required></v-text-field>
                        <v-file-input ref="fileInput" label="Imágenes" multiple accept="image/*" chips clearable @change="handleImageUpload"></v-file-input>
                        <v-row>
                            <v-col v-for="(image, index) in form.images" :key="index" cols="12" sm="6" md="4">
                                <v-img :src="image" height="150px"></v-img>
                                <v-btn prepend-icon="mdi-delete" color="red-darken-3" variant="text" @click="removeImage(index)"></v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn text @click="projectDialog = false">Cancelar</v-btn>
                    <v-btn color="primary" @click="addProject">Agregar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
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
                overlay : false,
                headers: [{
                        title: "Servicio",
                        key: "service.name"
                    },
                    {
                        title: "Tipo de servicio",
                        key: "service.tipoDeServicio.tipo"
                    },
                    {
                        title: "Usuario",
                        key: "fullName"
                    },
                    {
                        title: "Descripción",
                        key: "description"
                    },
                    {
                        title: "Acciones",
                        key: "actions",
                        sortable: false
                    }
                ],
                featuredProjects: [],
                scheduleServices: [],
                form: {
                    scheduleService: null,
                    service: null,
                    description: "",
                    imageFiles: [],
                    images: []
                },
                projectDialog: false,
                isEdit: false,
                currentProjectId: null
            };
        },
        computed: {
            processedProjects() {
                return this.featuredProjects.map(project => ({
                    ...project,
                    fullName: project.scheduleService.user ?
                        `${project.scheduleService.user.name} ${project.scheduleService.user.apellidoP} ${project.scheduleService.user.apellidoM}` :
                        'N/A'
                }));
            }
        },
        methods: {
            async getFeaturedProjects() {
                this.overlay = true
                try {
                    const {
                        data
                    } = await api.get("/feature/get");
                    this.featuredProjects = data.projects;
                    this.overlay = false
                } catch (error) {
                    console.error("Error fetching featured projects", error);
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
            async addProject() {
                this.overlay = true
                try {
                    const token = localStorage.getItem("token");
                    const datos = {
                        scheduleService: this.form.scheduleService,
                        description: this.form.description,
                        images: this.form.images
                    };
    
                    const {
                        data
                    } = await api.post("/feature/add", datos, {
                        headers: {
                            Authorization: "Bearer " + token,
                            rol: "admin"
                        }
                    });
    
                    if (data.success) {
                        toast.success("Proyecto agregado correctamente");
                    } else {
                        toast.error(data.msg);
                    }
                    this.getFeaturedProjects();
                    this.projectDialog = false;
                } catch (error) {
                    this.overlay = false
                    console.error("Error adding project", error);
                    toast.error("Error al agregar el proyecto");
                }
            },
            async deleteProject(project) {
                const token = localStorage.getItem("token");
                try {
                    const {
                        data
                    } = await api.delete(`/feature/delete/${project._id}`, {
                        headers: {
                            Authorization: "Bearer " + token,
                            rol: "admin"
                        }
                    });
                    if (data.success) {
                        toast.success("Proyecto eliminado correctamente");
                    } else {
                        toast.error(data.msg);
                    }
                    this.getFeaturedProjects();
                } catch (error) {
                    console.error("Error deleting project", error);
                    toast.error("Error al eliminar el proyecto");
                }
            },
            viewProject(project) {
                this.$router.push({
                    name: 'featureinfo',
                    params: {
                        id: project._id
                    }
                });
                console.log("Ver proyecto:", project);
            },
            openEditDialog(project) {
                this.isEdit = true;
                this.currentProjectId = project._id;
                this.form = {
                    scheduleService: project.scheduleService._id,
                    service: project.service._id,
                    description: project.description,
                    imageFiles: [],
                    images: project.images
                };
                this.projectDialog = true;
            },
            openAddDialog() {
                this.isEdit = false;
                this.form = {
                    scheduleService: null,
                    service: null,
                    description: "",
                    imageFiles: [],
                    images: []
                };
                this.projectDialog = true;
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
                        }
                    };
                    reader.readAsDataURL(file);
                }
    
                // Limpiar el input de archivo después de seleccionar una imagen
                this.$refs.fileInput.value = "";
            },
            removeImage(index) {
                this.form.images.splice(index, 1);
            }
        },
        mounted() {
            this.getFeaturedProjects();
            this.getScheduleServices();
        }
    };
    </script>