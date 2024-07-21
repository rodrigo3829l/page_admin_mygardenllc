<template>
<v-container>
    <v-card flat>
        <v-card-title>Empleados</v-card-title>
        <v-card-text>
            <v-data-table :headers="headers" :items="employeds">
                <template v-slot:item.status="{ item }">
                    <v-chip :color="getStatusColor(item.status)" dark>
                        {{ getStatusText(item.status) }}
                    </v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-btn variant="text" @click="openEditDialog(item)" color="yellow-darken-3" prepend-icon="mdi-pencil">
                        Actualizar
                    </v-btn>
                    <v-btn :loading="item.loading" :disabled="item.loading" variant="text" @click="toggleStatus(item)" :color="item.status === 'hired' ? 'red-darken-3' : 'green-darken-3'" prepend-icon="mdi-power">
                        <div v-if="item.status === 'hired'">Despedir</div>
                        <div v-else>Reincorporar</div>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
    <v-btn color="green-darken-3" block @click="openAddDialog">Agregar Empleado</v-btn>

    <v-dialog v-model="employeeDialog" width="600">
        <v-card>
            <v-card-title>{{ isEdit ? "Editar Empleado" : "Agregar Empleado" }}</v-card-title>
            <v-card-text>
                <v-form ref="employeeForm">
                    <v-text-field v-model="form.name" label="Nombre" required></v-text-field>
                    <v-text-field v-model="form.apellidoP" label="Apellido Paterno" required></v-text-field>
                    <v-text-field v-model="form.apellidoM" label="Apellido Materno" required></v-text-field>
                    <v-text-field v-model="form.email" label="Email" required></v-text-field>
                    <v-text-field v-model="form.cellPhone" label="Teléfono" required></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn text @click="employeeDialog = false">Cancelar</v-btn>
                <v-btn v-if="isEdit" color="primary" @click="updateEmployee">Editar</v-btn>
                <v-btn v-else color="primary" @click="addEmployee">Agregar</v-btn>
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
                    key: "apellidoP",
                    title: "Apellido Paterno"
                },
                {
                    key: "apellidoM",
                    title: "Apellido Materno"
                },
                {
                    key: "email",
                    title: "Email"
                },
                {
                    key: "cellPhone",
                    title: "Teléfono"
                },
                {
                    key: "status",
                    title: "Status"
                },
                {
                    title: "Acciones",
                    key: "actions",
                    sortable: false,
                    align: "center"
                },
            ],
            employeds: [],
            form: {
                name: "",
                apellidoP: "",
                apellidoM: "",
                email: "",
                cellPhone: "",
            },
            employeeDialog: false,
            isEdit: false,
            currentEmployeeId: null,
        };
    },
    methods: {
        getStatusColor(status) {
            if (status === "hired") return "green";
            if (status === "fired") return "red";
            return "blue";
        },
        getStatusText(status) {
            if (status === "hired") return "Hired";
            if (status === "fired") return "Fired";
            return "Other";
        },
        async getEmployeds() {
            try {
                // const token = localStorage.getItem("token");
                const {
                    data
                } = await api.get("/employed/get");

                this.employeds = data.employeds.map((employee) => ({
                    ...employee,
                    loading: false,
                }));
            } catch (error) {
                console.log(error);
            }
        },
        openEditDialog(employee) {
            this.isEdit = true;
            this.currentEmployeeId = employee._id;
            this.form = {
                name: employee.name,
                apellidoP: employee.apellidoP,
                apellidoM: employee.apellidoM,
                email: employee.email,
                cellPhone: employee.cellPhone,
            };
            this.employeeDialog = true;
        },
        openAddDialog() {
            this.isEdit = false;
            this.form = {
                name: "",
                apellidoP: "",
                apellidoM: "",
                email: "",
                cellPhone: "",
            };
            this.employeeDialog = true;
        },
        async updateEmployee() {
            // const token = localStorage.getItem("token");
            // try {
            //     const {
            //         data
            //     } = await api.put(`/employed/edit/${this.currentEmployeeId}`, this.form, {
            //         headers: {
            //             'Authorization': 'Bearer ' + token,
            //             'rol': 'admin',
            //         },
            //     });
            //     if (data.success) {
            //         toast.success("Empleado actualizado correctamente");
            //     } else {
            //         toast.error(data.msg);
            //     }
            //     this.getEmployeds();
            //     this.employeeDialog = false;
            // } catch (error) {
            //     toast.error("Error al actualizar el empleado");
            // }
        },
        async addEmployee() {
            const token = localStorage.getItem("token");
            try {
                const {
                    data
                } = await api.post("/employed/add", this.form, {
                    headers: {
                        Authorization: "Bearer " + token,
                        rol: "admin",
                    },
                });
                if (data.success) {
                    toast.success("Empleado agregado correctamente");
                } else {
                    toast.error(data.msg);
                }
                this.getEmployeds();
                this.employeeDialog = false;
            } catch (error) {
                toast.error("Error al agregar el empleado");
            }
        },
        async toggleStatus(employee) {
            employee.loading = true;
            const token = localStorage.getItem("token");
            try {
                const {
                    data
                } = await api.put(`/employed/change/${employee._id}`, null, {
                    headers: {
                        Authorization: "Bearer " + token,
                        rol: "admin",
                    },
                });
                if (data.success) {
                    toast.success(`Estado del empleado cambiado correctamente`);
                } else {
                    toast.error(data.msg);
                }
                this.getEmployeds();
            } catch (error) {
                toast.error("Error al cambiar el estado del empleado");
            } finally {
                employee.loading = false;
            }
        },
    },
    mounted() {
        this.getEmployeds();
    },
};
</script>
