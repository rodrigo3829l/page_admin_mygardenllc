<template>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1>{{ ($t('admin.cotize.quoteService.serviceString')) }}</h1>
                <p>{{ ($t('admin.cotize.quoteService.desString')) }}</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <v-autocomplete v-model="employed" :items="itemsEmployed" item-title="name" item-value="data"
                    :error-messages="errors.employed" @update:model-value="addEmployed" variant="outlined"
                    :label="$t('admin.cotize.quoteService.employeeString')" color="green-darken-3">
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
                    :label="$t('admin.cotize.quoteService.productsString')" color="green-darken-3">
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
                                        color="green-darken-3" :label="$t('admin.cotize.quoteService.amountString')" density="compact" style="width: 100px;">
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
                <v-text-field v-model="laborCost" type="number" :label="$t('admin.cotize.quoteService.costString')" variant="outlined"
                    color="green-darken-3" :error-messages="errors.labor" @input="validateLabor">
                </v-text-field>
            </v-col>
            <v-col cols="6">
                <v-text-field v-model="machineryCost" type="number" :label="$t('admin.cotize.quoteService.costMachinery')" variant="outlined"
                    color="green-darken-3" :error-messages="errors.machinery" @input="validateMach" >
                </v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-right">
                <v-btn color="green-darken-3" @click="quote" :disabled="overlay">{{ ($t('admin.cotize.quoteService.quoteString')) }}</v-btn>
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
import { numberValidate } from '@/plugins/validations.js'
export default {
    data() {
        return {
            items: [
                {
                    title: 'Home',
                    disabled: false,
                    href: '/admin/quote',
                },
                {
                    title: 'Quote',
                    disabled: true,
                    href: '/admin/quote',
                },
            ],
            overlay: false,
            employed: '',
            product: '',
            laborCost: '',
            machineryCost: '',
            itemsEmployed: [],
            itemsProducts: [],
            selectedEmployeds: [],
            selectedProducts: [],
            errors: {
                product: '',
                employed: '',
                labor : '',
                machinery : ''
            },
            
        }
    },
    methods: {
        validateLabor(){
            this.errors.labor = numberValidate(this.laborCost)
        },
        validateMach(){
            this.errors.machinery = numberValidate(this.machineryCost)
        },
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
            this.validateLabor()
            this.validateMach()
            if(this.selectedProducts.length < 1){
                this.errors.product = 'Selecciona almenos un producto'
                return
            }
            if(this.selectedEmployeds.length < 1){
                this.errors.employed = 'Selecciona almenos un empleado'
                return
            }
            if(this.errors.machinery !== '' || this.errors.labor !== ''){
                toast.warning('Por favor llenar correctaente los campos')
                return
            }
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
                    toast.error(this.$t('admin.cotize.quoteService.quoteServiceString'))
                } else {
                    toast.success(this.$t('admin.cotize.quoteService.quotedSuccess'))
                    setTimeout(() => {
                        this.$router.push({name: 'quote'});
                    }, 1500);

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
                    this.errors.employed = (this.$t('admin.cotize.quoteService.existsString'))
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
                    this.errors.product = (this.$t('admin.cotize.quoteService.selectProduct'))
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
