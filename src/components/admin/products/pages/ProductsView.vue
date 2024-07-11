<template>
<v-container>
    <v-card flat>
        <v-card-title>Productos</v-card-title>
        <v-card-text>
            <v-data-table :headers="headers" :items="products">
                <template v-slot:item.isUsable="{ item }">
                    <v-chip :color="item.isUsable ? 'green' : 'red'" dark>
                        {{ item.isUsable ? 'Usable' : 'No Usable' }}
                    </v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-btn variant="text" @click="openEditDialog(item)" color="yellow-darken-3" prepend-icon="mdi-pencil">
                        Actualizar
                    </v-btn>
                    <v-btn :loading="item.loading" :disabled="item.loading" variant="text" @click="toggleUsable(item)" :color="item.isUsable ? 'red-darken-3' : 'green-darken-3'" prepend-icon="mdi-power">
                        <div v-if="item.isUsable">Desactivar</div>
                        <div v-else>Activar</div>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
    <v-btn color="green-darken-3" block @click="openAddDialog">Agregar Producto</v-btn>

    <v-dialog v-model="productDialog" width="600">
        <v-card>
            <v-card-title>{{ isEdit ? "Editar Producto" : "Agregar Producto" }}</v-card-title>
            <v-card-text>
                <v-form ref="productForm">
                    <v-text-field v-model="form.product" label="Producto" required></v-text-field>
                    <v-text-field v-model="form.price" label="Precio" type="number" required></v-text-field>
                    <v-text-field v-model="form.quantity" label="Cantidad" type="number" required></v-text-field>
                    <v-select v-model="form.unit" :items="units" item-title="name" item-value="name" label="Unidad" required></v-select>
                    <v-select v-model="form.provider" :items="providers" item-title="providerName" item-value="providerName" label="Proveedor" required></v-select>
                </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn text @click="productDialog = false">Cancelar</v-btn>
                <v-btn v-if="isEdit" color="primary" @click="updateProduct">Editar</v-btn>
                <v-btn v-else color="primary" @click="addProduct">Agregar</v-btn>
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
                    key: "product",
                    title: "Producto"
                },
                {
                    key: "price",
                    title: "Precio"
                },
                {
                    key: "quantity",
                    title: "Cantidad"
                },
                {
                    key: "unit.name",
                    title: "Unidad"
                },
                {
                    key: "provider.providerName",
                    title: "Proveedor"
                },
                {
                    key: "isUsable",
                    title: "Usable"
                },
                {
                    title: "Acciones",
                    key: "actions",
                    sortable: false,
                    align: "center",
                },
            ],
            products: [],
            units: [],
            providers: [],
            form: {
                product: "",
                price: "",
                quantity: "",
                unit: null,
                provider: null,
            },
            productDialog: false,
            isEdit: false,
            currentProductId: null,
        };
    },
    methods: {
        async getProducts() {
            try {
                const {
                    data
                } = await api.get("/products/get");
                this.products = data.allProducts.map(product => ({
                    ...product,
                    loading: false,
                }));
            } catch (error) {
                console.log(error);
            }
        },
        async getUnits() {
            try {
                const {
                    data
                } = await api.get("/unit/get");
                this.units = data.data;
            } catch (error) {
                console.log(error);
            }
        },
        async getProviders() {
            try {
                const {
                    data
                } = await api.get("/provider/get");
                this.providers = data.data;
            } catch (error) {
                console.log(error);
            }
        },
        openEditDialog(product) {
            this.isEdit = true;
            this.currentProductId = product._id;
            this.form = {
                product: product.product,
                price: product.price,
                quantity: product.quantity,
                unit: product.unit.name,
                provider: product.provider.providerName,
            };
            this.productDialog = true;
        },
        openAddDialog() {
            this.isEdit = false;
            this.form = {
                product: "",
                price: 0,
                quantity: 0,
                unit: null,
                provider: null,
            };
            this.productDialog = true;
        },
        async updateProduct() {
            const token = localStorage.getItem("token");
            try {
                const {
                    data
                } = await api.put(`/products/update/${this.currentProductId}`, this.form, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'rol': 'admin',
                    },
                });
                if (data.success) {
                    toast.success("Producto actualizado correctamente");
                } else {
                    toast.error(data.msg)
                }
                this.getProducts();
                this.productDialog = false;
            } catch (error) {
                console.log(error)
                toast.error("Error al actualizar el producto");
            }
        },
        async addProduct() {
            const token = localStorage.getItem("token");
            try {
                const {
                    data
                } = await api.post("/products/add", this.form, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'rol': 'admin',
                    },
                });
                if (data.success) {
                    toast.success("Producto agregado correctamente");
                } else {
                    toast.error(data.msg)
                }
                this.getProducts();
                this.productDialog = false;
            } catch (error) {
                console.log(error)
                toast.error("Error al agregar el producto");
            }
        },
        async toggleUsable(product) {
            const token = localStorage.getItem("token");
            try {
                const {
                    data
                } = await api.put(`/products/usuable/${product._id}`, null, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'rol': 'admin',
                    },
                });
                if (data.success) {
                    toast.success(`Estado del producto cambiado correctamente`);
                } else {
                    toast.error(data.msg)
                }
                this.getProducts();
            } catch (error) {
                console.log(error)
                toast.error("Error al cambiar el estado del producto");
            }
        },
    },
    mounted() {
        this.getProducts();
        this.getUnits();
        this.getProviders();
    },
};
</script>
