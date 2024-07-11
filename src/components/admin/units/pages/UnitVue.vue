<template>
<v-container>
    <v-card flat>
        <v-card-title>Unidades</v-card-title>
        <v-card-text>
            <v-data-table :headers="headers" :items="units">
                <template v-slot:item.actions="{ item }">
                    <v-btn variant="text" @click="openEditDialog(item)" color="yellow-darken-3" prepend-icon="mdi-pencil">
                        Actualizar
                    </v-btn>
                    <v-btn :loading="item.loading" :disabled="item.loading" variant="text" @click="deleteUnit(item)" color="red-darken-3" prepend-icon="mdi-delete">
                        Eliminar
                    </v-btn>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
    <v-btn color="green-darken-3" block @click="openAddDialog">Agregar Unidad</v-btn>

    <v-dialog v-model="unitDialog" width="600">
        <v-card>
            <v-card-title>{{ isEdit ? "Editar Unidad" : "Agregar Unidad" }}</v-card-title>
            <v-card-text>
                <v-form ref="unitForm">
                    <v-text-field v-model="form.name" label="Nombre de la unidad" required></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn text @click="unitDialog = false">Cancelar</v-btn>
                <v-btn v-if="isEdit" color="primary" @click="updateUnit">Editar</v-btn>
                <v-btn v-else color="primary" @click="addUnit">Agregar</v-btn>
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
                    key: "name",
                    title: "Nombre"
                },
                {
                    title: "Acciones",
                    key: "actions",
                    sortable: false,
                    align: "center",
                },
            ],
            units: [],
            form: {
                name: "",
            },
            unitDialog: false,
            isEdit: false,
            currentUnitId: null,
        };
    },
    methods: {
        async getUnits() {
            try {
                const {
                    data
                } = await api.get("/unit/get");
                this.units = data.data.map(unit => ({
                    ...unit,
                    loading: false,
                }));
            } catch (error) {
                console.log(error);
            }
        },
        openEditDialog(unit) {
            this.isEdit = true;
            this.currentUnitId = unit._id;
            this.form = {
                ...unit
            };
            this.unitDialog = true;
        },
        openAddDialog() {
            this.isEdit = false;
            this.form = {
                name: "",
            };
            this.unitDialog = true;
        },
        async updateUnit() {
            const token = localStorage.getItem("token");
            try {
                const {data} = await api.put(`/unit/update/${this.currentUnitId}`, this.form, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'rol': 'admin',
                    },
                });
                if (data.success){
                    toast.success("Se actualizo correctamente la unidad");
                }else{
                    toast.error(data.msg)
                }
                this.getUnits();
                this.unitDialog = false;
            } catch (error) {
                toast.error(error);
            }
        },
        async addUnit() {
            const token = localStorage.getItem("token");
            try {
                const {data} = await api.post("/unit/add", this.form, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'rol': 'admin',
                    },
                });
                if (data.success){
                    toast.success("Se agrego correctamente la unidad");
                }else{
                    toast.error(data.msg)
                }
                this.getUnits();
                this.unitDialog = false;
            } catch (error) {
                toast.error(error);
            }
        },
        async deleteUnit(unit) {
            unit.loading = true;
            const token = localStorage.getItem("token");
            try {
                const {data} = await api.delete(`/unit/delete/${unit._id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'rol': 'admin',
                    },
                });
                if (data.success){
                    toast.success("Unidad eliminada exitosamente");
                }else{
                    toast.error(data.msg)
                }
                this.getUnits();
            } catch (error) {
                toast.error(error);
            } finally {
                unit.loading = false;
            }
        },
    },
    mounted() {
        this.getUnits();
    },
};
</script>
