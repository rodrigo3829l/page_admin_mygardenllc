<template>
<v-container>
    <v-row>
        <v-col cols="8">
            <v-form>
                <v-row>
                    <v-col cols="12">
                        <v-label>Usuario</v-label>
                        <v-select v-model="selected" :items="users" item-title="name" item-value="_id" @update:model-value="console.log(selected)" label="Selecciona un usuario"></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-label>Nombre</v-label>
                        <v-text-field :disabled="selected.length > 0" v-model="formData.user" label="Nombre"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-label>Apellido Paterno</v-label>
                        <v-text-field :disabled="selected.length > 0" v-model="formData.lastName" label="Apellido Paterno"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="4">
                        <v-label>Apellido Materno</v-label>
                        <v-text-field :disabled="selected.length > 0" v-model="formData.middleName" label="Apellido Materno"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-label>Teléfono</v-label>
                        <v-text-field :disabled="selected.length > 0" v-model="formData.phone" label="Teléfono"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-label>Lada</v-label>
                        <v-select :disabled="selected.length > 0" v-model="formData.areaCode" :items="[52, 1]" label="Lada"></v-select>
                    </v-col>

                </v-row>
                <v-row>
                    <v-col cols="4">
                        <v-label>Email</v-label>
                        <v-text-field :disabled="selected.length > 0" v-model="formData.email" label="Email"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-label>Código Postal</v-label>
                        <v-row no-gutters>
                            <v-col cols="9">
                                <v-text-field :disabled="selected.length > 0" v-model="formData.postalCode" label="Código Postal"></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-btn :disabled="selected.length > 0" @click="validatePostalCode" class="ma-2">Validar</v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-label>Vecindario</v-label>
                        <v-text-field  v-model="formData.neighborhood"  label="Vecindario" :disabled="!cpValidate || selected.length > 0"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-label>Ciudad</v-label>
                        <v-text-field v-model="formData.city" label="Ciudad" :disabled="!cpValidate || selected.length > 0"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-label>Calle</v-label>
                        <v-select v-model="formData.street" required label="Calle" :disabled="!cpValidate || selected.length > 0" :items="['Peachtree Street',
                      'Marietta Street', 
                      'Decatur Street', 
                      'Spring Street', 
                      'Auburn Avenue', 
                      'Monroe Drive', 
                      'North Avenue', 
                      'Boulevard', 
                      'Ponce de Leon Avenue', 
                      'Irwin Street', 
                      'Edgewood Avenue', 
                      'Mitchell Street',
                      'Chicory Way',
                      'Churchill Heights',
                      'Clarinbridge Way',
                      'Cobblestone Way',
                      'Columbia Bay',
                      'Cranchester Way',
                      'Whittenham Clse'
                    ]"></v-select>
                    </v-col>
                    <v-col cols="6">
                        <v-label>Número</v-label>
                        <v-text-field v-model="formData.houseNumber" label="Número" :disabled="!cpValidate || selected.length > 0"></v-text-field>
                    </v-col>
                </v-row>
            </v-form>
        </v-col>
        <v-col cols="4">
            <v-form>
                <v-row>
                    <v-col cols="12">
                        <v-label>Tipo de Servicio</v-label>
                        <v-select v-model="formData.serviceType" :items="serviceTypes" item-title="tipo" item-value="_id" label="Tipo de Servicio" @update:model-value="fetchServices"></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-label>Selecciona un servicio</v-label>
                        <v-select v-model="formData.service" :items="services" item-title="name" item-value="_id" label="Selecciona un servicio" :disabled="!formData.serviceType"></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-label>Descripción del Servicio</v-label>
                        <v-textarea v-model="formData.serviceDescription" label="Descripción del Servicio" :disabled="!formData.service"></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-label>Fecha del Servicio</v-label>
                        <v-text-field v-model="formData.serviceDate" label="Fecha del Servicio" :disabled="!formData.service" type="date"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-btn @click="scheduleService" block>Agendar Servicio</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import {
    api
} from "@/axios/axios.js";
import {
    toast
} from 'vue3-toastify';
import axios from 'axios';
export default {
    data() {
        return {
            selected : '',
            formData: {
                user: '',
                firstName: '',
                lastName: '',
                middleName: '',
                postalCode: '',
                neighborhood: '',
                city: '',
                street: '',
                houseNumber: '',
                phone: '',
                areaCode: '',
                email: '',
                serviceType: '',
                service: '',
                serviceDescription: '',
                serviceDate: ''
            },
            cpValidate: false,
            users: [],
            serviceTypes: [],
            services: [],
            isFormValid: false
        };
    },
    watch: {
        formData: {
            handler() {
                this.isFormValid = this.checkFormValidity();
            },
            deep: true
        }
    },
    mounted() {
        this.fetchServiceTypes();
        this.fetchUsers()
    },
    computed: {
        formattedUsers() {
            return this.users.map(user => ({
                ...user,
                fullName: `${user.name} ${user.apellidoP} ${user.apellidoM}`
            }));
        },
    },
    methods: {
        fetchServiceTypes() {
            api.get('/typeservice/get')
                .then(response => {
                    if (response.data.success) {
                        console.log(response.data)
                        this.serviceTypes = response.data.tipesServices;
                    } else {
                        toast.error('Error fetching service types');
                    }
                })
                .catch(error => {
                    toast.error('Error fetching service types');
                    console.error(error);
                });
        },
        fetchServices() {
            api.get(`/services/getByType/${this.formData.serviceType}`)
                .then(response => {
                    if (response.data.success) {
                        console.log(response.data)
                        this.services = response.data.services;
                    } else {
                        toast.error('Error fetching services');
                    }
                })
                .catch(error => {
                    toast.error('Error fetching services');
                    console.error(error);
                });
        },
        fetchUsers() {
            api.get(`/user/getOffline`)
                .then(response => {
                    if (response.data.success) {
                        console.log(response.data)
                        this.users = response.data.users;
                    } else {
                        toast.error('Error fetching services');
                    }
                })
                .catch(error => {
                    toast.error('Error fetching services');
                    console.error(error);
                });
        },
        async validatePostalCode() {
            // Example of validate postal code method
            this.loadBtn = true;

            if (this.formData.postalCode.length !== 5 || !/^\d+$/.test(this.formData.postalCode)) {
                toast.error('Código postal inválido');
                this.cpValidate = false;
                this.loadBtn = false;
                return;
            }

            try {
                const response = await axios.get(`https://api.zippopotam.us/us/${this.formData.postalCode}`);
                const data = response.data;

                const placeName = data.places[0]['place name'];
                if (placeName.toLowerCase() === 'atlanta') {
                    toast.success('Código postal válido');
                    this.cpValidate = true;
                    this.formData.city = placeName;
                } else {
                    toast.error('Solo se permite el servicio en Atlanta');
                    this.cpValidate = false;
                }
            } catch (error) {
                toast.error('Error al validar el código postal');
                console.error("Error fetching postal code info:", error);
                this.cpValidate = false;
            } finally {
                this.loadBtn = false;
            }
        },
        checkFormValidity() {
            return (
                this.formData.user &&
                this.formData.firstName &&
                this.formData.lastName &&
                this.formData.middleName &&
                this.formData.postalCode &&
                this.formData.neighborhood &&
                this.formData.city &&
                this.formData.street &&
                this.formData.houseNumber &&
                this.formData.phone &&
                this.formData.areaCode &&
                this.formData.email &&
                this.formData.serviceType &&
                this.formData.service &&
                this.formData.serviceDescription &&
                this.formData.serviceDate
            );
        },
        async scheduleService() {
            //if (this.isFormValid) {
            try {
                let datos
                
                const token = localStorage.getItem('token'); // Replace with actual token
                let myData
                if(this.selected.length <= 0){
                    datos = {
                        name: this.formData.firstName,
                        apellidoP: this.formData.lastName,
                        apellidoM: this.formData.middleName,
                        cellPhone: this.formData.phone,
                        direccion: {
                            neighborhood: this.formData.neighborhood,
                            numCasa: this.formData.houseNumber,
                            postalCode: this.formData.areaCode,
                            ciudad: this.formData.city,
                            calle: this.formData.street,
                        },
                        email: this.formData.email,
                        service: this.formData.service,
                        description: this.formData.serviceDescription,
                        img: null,
                        typeReserve: 'offline',
                        scheduledTime: this.formData.serviceDate
                    }
                    const {
                        data
                    } = await api.post('/schedule/scheduleOfline', datos, {
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'rol': 'admin',
                        }
                    });
                    myData = data
                }else{
                    datos = {
                        userId: this.selected,
                        service: this.formData.service,
                        description: this.formData.serviceDescription,
                        img: null,
                        typeReserve: 'offline',
                        scheduledTime: this.formData.serviceDate
                    }
                    const {
                        data
                    } = await api.post('/schedule/scheduleOfline', datos, {
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'rol': 'admin',
                        }
                    });
                    myData = data
                }

                if (myData.success) {
                    toast.success('Servicio agendado con éxito');
                    this.resetForm();
                } else {
                    toast.error(myData.msg || 'Error al agendar el servicio');
                }
            } catch (error) {
                toast.error('Error al agendar el servicio');
                console.error(error);
            }
            // } else {
            //     toast.error('Por favor, completa todos los campos');
            // }
        },
        resetForm() {
            this.formData = {
                user: '',
                firstName: '',
                lastName: '',
                middleName: '',
                postalCode: '',
                neighborhood: '',
                city: '',
                street: '',
                houseNumber: '',
                phone: '',
                areaCode: '',
                email: '',
                serviceType: '',
                service: '',
                serviceDescription: '',
                serviceDate: ''
            };
            this.cpValidate = false;
        }
    }
};
</script>

<style>
.ma-2 {
    margin: 0 8px;
}
</style>
