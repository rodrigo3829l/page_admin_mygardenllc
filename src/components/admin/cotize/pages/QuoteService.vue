<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1>Cotiza un servicio</h1>
                <p>Selecciona empleados y productos para el servicio</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <v-autocomplete v-model="employed" :items="itemsEmployed" item-title="name" item-value="data"
                    :error-messages="errors.employed" @update:model-value="addEmployed" variant="outlined"
                    label="Selecciona a los empleados" color="green-darken-3">
                </v-autocomplete>
                <v-card>
                    <v-list v-if="selectedEmployeds.length > 0">
                        <v-list-item v-for="selectedEmployed in selectedEmployeds" :key="selectedEmployed.id">
                            <v-row>
                                <v-col cols="10">

                                    <v-icon>mdi-account</v-icon> {{ selectedEmployed.name }}

                                </v-col>
                                <v-col cols="2">
                                    <v-list-item-action>
                                        <v-icon @click="removeEmployed(selectedEmployed.id)">mdi-close</v-icon>
                                    </v-list-item-action>
                                </v-col>
                            </v-row>
                        </v-list-item>

                    </v-list>
                </v-card>
            </v-col>
            <v-col cols="6">
                <v-autocomplete v-model="product" :items="itemsProducts" item-title="name" item-value="data"
                    :error-messages="errors.product" @update:model-value="addProduct" variant="outlined"
                    label="Selecciona los productos" color="green-darken-3">
                </v-autocomplete>
                <v-card>
                    <v-list v-if="selectedProducts.length > 0">
                        <v-list-item v-for="selectedProduct in selectedProducts" :key="selectedProduct.id">
                            <v-row>
                                <v-col cols="6">

                                    <v-icon>mdi-package-variant</v-icon> {{ selectedProduct.name }}

                                </v-col>
                                <v-col cols="4">
                                    <v-text-field v-model="selectedProduct.quantity" type="number" variant="outlined"
                                        color="green-darken-3" label="Cantidad" density="compact" style="width: 100px;">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="2">
                                    <v-list-item-action>
                                        <v-icon @click="removeProduct(selectedProduct.id)">mdi-close</v-icon>
                                    </v-list-item-action>
                                </v-col>
                            </v-row>
                        </v-list-item>


                    </v-list>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <v-text-field v-model="laborCost" label="Costo de la mano de obra" variant="outlined"
                    color="green-darken-3">
                </v-text-field>
            </v-col>
            <v-col cols="6">
                <v-text-field v-model="machineryCost" label="Costo adicional de maquinaria" variant="outlined"
                    color="green-darken-3">
                </v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-right">
                <v-btn color="green-darken-3" @click="quote" :disabled="overlay">Cotizar</v-btn>
            </v-col>
        </v-row>
    </v-container>
    <v-overlay :model-value="overlay" class="align-center justify-center">
        <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
</template>


<script>
import { api } from '@/axios/axios'
import { toast } from 'vue3-toastify'
export default {
    data() {
        return {
            overlay: false,
            employed: '',
            product: '',
            laborCost: 0,
            machineryCost: 0,
            itemsEmployed: [],
            itemsProducts: [],
            selectedEmployeds: [],
            selectedProducts: [],
            errors: {
                product: '',
                employed: ''
            }
        }
    },
    methods: {
        async getEmployeds() {
            try {
                const token = localStorage.getItem('token')
                const { data } = await api({
                    method: 'GET',
                    url: '/employed/get',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'rol': 'admin'
                    },
                })
                // Mapear los empleados en el formato deseado
                const formattedEmployeds = data.employeds.map(employed => ({
                    name: `${employed.name} ${employed.apellidoP} ${employed.apellidoM}`,
                    data: {
                        id: employed._id,
                        name: `${employed.name} ${employed.apellidoP} ${employed.apellidoM}`,
                    }
                }));

                // Asignar los empleados formateados a una variable
                this.itemsEmployed = formattedEmployeds;
            } catch (error) {
                console.log(error)
            }
        },
        async getProducts() {
            try {
                const token = localStorage.getItem('token')
                const { data } = await api({
                    method: 'GET',
                    url: '/products/get',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'rol': 'admin'
                    },
                })
                const formattedProducts = data.usableProducts.map(usableProduct => ({
                    name: usableProduct.product,
                    data: {
                        id: usableProduct._id,
                        name: usableProduct.product,
                    }

                }));

                // Asignar los empleados formateados a una variable
                this.itemsProducts = formattedProducts;
            } catch (error) {
                console.log(error)
            }
        },
        async quote() {
            this.overlay = true
            // Obtener los IDs de los empleados seleccionados
            const employedsIds = this.selectedEmployeds.map(employed => employed.id);

            // Obtener los IDs y cantidades de los productos seleccionados
            const productsData = this.selectedProducts.map(product => ({
                product: product.id,
                quantity: product.quantity
            }));

            try {
                const datos = {
                    products: productsData,
                    additionalCosts: {
                        labor: this.laborCost,
                        machinery: this.machineryCost
                    },
                    employeds: employedsIds
                }

                const token = localStorage.getItem('token')
                const { data } = await api({
                    method: 'POST',
                    url: `/schedule/quote/${this.$route.params.id}`,
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'rol': 'admin',
                    },
                    data: datos
                })
                console.log(data)
                if (!data.success) {
                    toast.error('No se pudo cotizar el servicio')
                } else {
                    toast.success('Servicio cotizado con exito')
                }
                console.log(datos)
            } catch (error) {
                console.log(error)
            } finally {
                this.overlay = false
            }
        },
        addEmployed() {
            if (this.employed) {
                if (this.selectedEmployeds.some(employed => employed.id === this.employed.id)) {
                    this.errors.employed = 'Ya seleccionaste este empleado'
                } else {
                    this.errors.employed = ''
                    this.selectedEmployeds.push(this.employed);
                }
            }
            this.employed = '';
        },
        addProduct() {
            if (this.product) {
                if (this.selectedProducts.some(product => product.id === this.product.id)) {
                    this.errors.product = 'Ya seleccionaste este producto'
                } else {
                    this.errors.product = ''
                    this.selectedProducts.push(this.product);
                }
            }
            this.product = '';
        },
        removeEmployed(id) {
            this.selectedEmployeds = this.selectedEmployeds.filter(employed => employed.id !== id)
        },
        removeProduct(id) {
            this.selectedProducts = this.selectedProducts.filter(product => product.id !== id)
        },

    },
    mounted() {
        this.getEmployeds()
        this.getProducts()
    }
}
</script>
