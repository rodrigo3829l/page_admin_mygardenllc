<template>
<v-breadcrumbs :items="items">
    <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
    </template>
</v-breadcrumbs>
<v-container>
    <v-card :title="$t('admin.cotize.cotizeWindow.serviceString')" flat>
        <template v-slot:text>
            <v-text-field v-model="search" :label="$t('admin.cotize.cotizeWindow.searchString')" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line></v-text-field>
        </template>

        <v-data-table :headers="headers" :items="services" :search="search">
            <template v-slot:item.Calificacion.total="{ item }">
                <v-rating v-model="item.Calificacion.total" color="yellow" readonly size="18"></v-rating>
            </template>
            <template v-slot:item.img.secure_url="{ item }">
                <v-img :src="item.img.secure_url" class="ma-2"></v-img>
            </template>
            <template v-slot:item.isUsable="{ item }">
                <v-chip :color="item.isUsable ? 'green' : 'red'" dark>
                    {{ item.isUsable ? 'Usable' : 'No Usable' }}
                </v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-btn variant="text" @click="openEditDialog(item)" color="yellow-darken-3" prepend-icon="mdi-pencil">
                    Actualizar
                </v-btn>
                <v-btn :loading="item.loading" :disabled="item.loading" variant="text" @click="changeStatus(item)" :color="item.isUsable ? 'red-darken-3' : 'green-darken-3'" prepend-icon="mdi-delete">
                    <div v-if="item.isUsable">Ocultar</div>
                    <div v-else>Mostrar</div>
                </v-btn>
            </template>
        </v-data-table>
    </v-card>
    <v-btn color="green-darken-3" block @click="openAddDialog">Agregar</v-btn>
</v-container>

<v-dialog v-model="serviceDialog" width="600">
    <v-card>
        <v-card-title>{{ isEdit ? "Editar Servicio" : "Agregar Servicio" }}</v-card-title>
        <v-card-text>
            <v-form ref="serviceForm">
                <v-text-field v-model="form.name" label="Nombre del servicio" required></v-text-field>
                <v-text-field v-model="form.description" label="Descripcion del servicio" required></v-text-field>
                <!-- Integración de v-file-input con handleImageUpload -->
                <v-file-input label="Imagen" accept="image/*" @change="handleImageUpload" :error-messages="errors.image" required></v-file-input>
                <v-select v-model="form.tipoDeServicio" :items="typeService" item-title="tipo" item-value="tipo" label="Tipo de servicio" item-text="name" required></v-select>
            </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
            <v-btn text @click="serviceDialog = false">Cancelar</v-btn>
            <v-btn v-if="isEdit" color="primary" @click="updateService">Editar</v-btn>
            <v-btn v-else color="primary" @click="addService">Agregar</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
import {
    api
} from "@/axios/axios.js";
import {
    toast
} from "vue3-toastify";
import {
    i18n
} from "@/main.js";

export default {
    data() {
        return {
            search: "",
            headers: [{
                    key: "name",
                    title: "Nombre"
                },
                {
                    key: "Calificacion.total",
                    title: "Rating"
                },
                {
                    key: "tipoDeServicio.tipo",
                    title: "Tipo de servicio"
                },
                {
                    title: "Imagen",
                    key: "img.secure_url"
                },
                {
                    key: "isUsable",
                    title: "Status"
                },
                {
                    title: i18n.global.t("admin.cotize.cotizeWindow.actionsString"),
                    key: "actions",
                    sortable: false,
                    align: "center",
                },
            ],
            services: [],
            form: {
                name: "",
                description: "",
                img: null,
                tipoDeServicio: "",
            },
            serviceDialog: false,
            isEdit: false,
            serviceTypes: [], // Add your service types here
            typeService: null,
            currentServiceId: null,
            errors: {
                image: "", // Error message for image upload
            },
            public_id : null
        };
    },
    methods: {
        async getServices() {
            try {
                const {
                    data
                } = await api.get("/services/get");
                this.services = data.services.map((service) => ({
                    ...service,
                    loading: false,
                }));
            } catch (error) {
                console.log(error);
            }
        },
        openEditDialog(service) {
            this.isEdit = true;
            this.currentServiceId = service._id;
            this.form = {
                ...service
            };
            this.serviceDialog = true;
        },
        openAddDialog() {
            this.isEdit = false;
            this.form = {
                name: "",
                description: "",
                img: null,
                tipoDeServicio: "",
            };
            this.serviceDialog = true;
        },
        async updateService() {
            const token = localStorage.getItem('token')
            try {
                const datos = {
                    name : this.form.name,
                    description :  this.form.description,
                    tipoDeServicio : this.form.tipoDeServicio.tipo,
                    img : this.form.img,
                    public_id : this.public_id
                }
                const { data } = await api({
                    method: 'PUT',
                    url: `/services/update/${this.currentServiceId}`,
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'rol': 'admin'
                    },
                    data: datos
                });
                if (data.success) {
                    toast.success("Servicio actualizado con éxito");
                } else {
                    toast.error(data.msg);
                }
                this.getServices();
                this.serviceDialog = false;
            } catch (error) {
                toast.error("Error al actualizar el servicio");
            }
        },
        async addService() {
            try {
                const token = localStorage.getItem('token')
                const {
                    data
                } = await api({
                    method: 'POST',
                    url: '/services/add',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'rol': 'admin'
                    },
                    data: this.form
                });

                if(data.success){
                    toast.success("Servicio aregado con exito")
                }else{
                    toast.error(data.msg)
                }
                this.getServices();
                this.serviceDialog = false;
            } catch (error) {
                toast.error("Error al agregar el servicio");
            }
        },
        async getTypesServices() {
            try {
                
                const {
                    data
                } = await api.get("/typeservice/get");
                this.typeService = data.tipesServices;
            } catch (error) {
                toast.error("Error al obtener los tipos de servicio");
            }
        },
        async changeStatus(service) {
            service.loading = true;
            const token = localStorage.getItem("token");
            try {
                const {
                    data
                } = await api({
                    method: "PUT",
                    url: `/services/usuable/${service._id}`,
                    headers: {
                        Authorization: "Bearer " + token,
                        rol: "admin",
                    },
                });
                if (data.success) {
                    toast.success(
                        `El servicio ha sido ${
                service.isUsable ? "ocultado" : "mostrado"
              } correctamente`
                    );
                } else {
                    toast.error(data.msg);
                }
                this.getServices();
            } catch (error) {
                toast.error("Error al cambiar el estado del servicio");
            } finally {
                service.loading = false;
            }
        },
        handleImageUpload(event) {
            this.public_id = this.form.img ? this.form.img.public_id : null;
            const file = event.target.files[0];

            // Check if a file is selected
            this.errors.image = !file ? this.$t("registration.alerts.imageFile") : "";

            // Check the file size (in bytes)
            const maxSize = 4 * 1024 * 1024; // 4 megabytes
            this.errors.image = file.size > maxSize ? this.$t("registration.alerts.sizeFile") : "";

            // Read the image as a Blob object
            const reader = new FileReader();
            reader.onload = (e) => {
                this.form.img = e.target.result;
            };

            // Check if the file type is an image
            if (file.type.startsWith("image/")) {
                reader.readAsDataURL(file);
            } else {
                this.errors.image = this.$t("registration.alerts.validImage");
            }
        },
    },
    mounted() {
        this.getServices();
        this.getTypesServices();
    },
};
</script>
