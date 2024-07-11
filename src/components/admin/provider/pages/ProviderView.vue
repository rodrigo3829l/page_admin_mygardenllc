<template>
<v-container>
    <v-card flat>
        <v-card-title>Proveedores</v-card-title>
        <v-card-text>
            <v-data-table :headers="headers" :items="providers">
                <template v-slot:item.usable="{ item }">
                    <v-chip :color="item.usable ? 'green' : 'red'" dark>
                        {{ item.usable ? 'Usable' : 'No Usable' }}
                    </v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-btn variant="text" @click="openEditDialog(item)" color="yellow-darken-3" prepend-icon="mdi-pencil">
                        Actualizar
                    </v-btn>
                    <v-btn :loading="item.loading" :disabled="item.loading" variant="text" @click="toggleStatus(item)" :color="item.usable ? 'red-darken-3' : 'green-darken-3'" prepend-icon="mdi-power">
                        <div v-if="item.usable">Desactivar</div>
                        <div v-else>Activar</div>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
    <v-btn color="green-darken-3" block @click="openAddDialog">Agregar Proveedor</v-btn>

    <v-dialog v-model="providerDialog" width="600">
        <v-card>
            <v-card-title>{{ isEdit ? "Editar Proveedor" : "Agregar Proveedor" }}</v-card-title>
            <v-card-text>
                <v-form ref="providerForm">
                    <v-text-field v-model="form.providerName" label="Nombre del proveedor" required></v-text-field>
                    <v-text-field v-model="form.contact" label="Contacto" required></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn text @click="providerDialog = false">Cancelar</v-btn>
                <v-btn v-if="isEdit" color="primary" @click="updateProvider">Editar</v-btn>
                <v-btn v-else color="primary" @click="addProvider">Agregar</v-btn>
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
            headers: [{
                    key: "_id",
                    title: "ID"
                },
                {
                    key: "providerName",
                    title: "Nombre del Proveedor"
                },
                {
                    key: "contact",
                    title: "Contacto"
                },
                {
                    key: "usable",
                    title: "Status"
                },
                {
                    title: "Acciones",
                    key: "actions",
                    sortable: false,
                    align: "center",
                },
            ],
            providers: [],
            form: {
                providerName: "",
                contact: "",
            },
            providerDialog: false,
            isEdit: false,
            currentProviderId: null,
        };
    },
    methods: {
        async getProviders() {
            try {
                const {
                    data
                } = await api.get("/provider/get");
                this.providers = data.data.map(provider => ({
                    ...provider,
                    loading: false,
                }));
            } catch (error) {
                console.log(error);
            }
        },
        openEditDialog(provider) {
            this.isEdit = true;
            this.currentProviderId = provider._id;
            this.form = {
                providerName: provider.providerName,
                contact: provider.contact,
            };
            this.providerDialog = true;
        },
        openAddDialog() {
            this.isEdit = false;
            this.form = {
                providerName: "",
                contact: "",
            };
            this.providerDialog = true;
        },
        async updateProvider() {
            const token = localStorage.getItem("token");
            try {
                const {data} = await api.put(`/provider/edit/${this.currentProviderId}`, this.form, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'rol': 'admin',
                    },
                });
                if(data.success){
                    toast.success("Proveedor actualizado correctamente");
                }else{
                    toast.error(data.msg)
                }
                this.getProviders();
                this.providerDialog = false;
            } catch (error) {
                toast.error("Error al actualizar el proveedor");
            }
        },
        async addProvider() {
            const token = localStorage.getItem("token");
            try {
                const {data}  = await api.post("/provider/add", this.form, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'rol': 'admin',
                    },
                });
                if(data.success){
                    toast.success("Proveedor agregado correctamente");
                }else{
                    toast.error(data.msg)
                }
                this.getProviders();
                this.providerDialog = false;
            } catch (error) {
                toast.error("Error al agregar el proveedor");
            }
        },
        async toggleStatus(provider) {
            provider.loading = true;
            const token = localStorage.getItem("token");
            try {
                const {data} = await api.put(`/provider/toggle/${provider._id}`, null, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'rol': 'admin',
                    },
                });
                if(data.success){
                    toast.success(`Estado del proveedor cambiado correctamente`);
                }else{
                    toast.error(data.msg)
                }
                this.getProviders();
            } catch (error) {
                toast.error("Error al cambiar el estado del proveedor");
            } finally {
                provider.loading = false;
            }
        },
    },
    mounted() {
        this.getProviders();
    },
};
</script>
