<template>
    <v-overlay :model-value="overlay" class="align-center justify-center">
        <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <div class="mx-10 my-2">
        <v-row>
            <v-col cols="12" md="9">
                <v-sheet>
                    <v-calendar ref="calendar" v-model="value" :events="events" :type="type" :weekdays="weekday"></v-calendar>
                </v-sheet>
            </v-col>
            <v-col cols="12" md="3">
                <div class="my-8">
                    <label for="">Seleccionar fecha</label><br>
                    <v-divider></v-divider><br>
                    <v-date-picker color="green-darken-3" v-model="fecha" @update:model-value="onDateSelected"></v-date-picker>
                    <v-divider></v-divider><br>
                    <label for="">Servicios proximos</label><br><br>
                    <div v-for="service in futureServices" :key="service">
                        <div >
                            <Upcoming v-show="service.status == 'quoting'" :service="service"></Upcoming>
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>
    </div>
    
    <v-dialog v-model="dialog" max-width="500">
        <v-card>
            <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
            <v-card-text>{{ dialogText }}</v-card-text>
            <v-card-actions>
                <v-btn color="green darken-1" text @click="onAccept">Aceptar</v-btn>
                <v-btn color="red darken-1" text @click="onCancel">Cancelar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </template>
    
        
    <script>
    import { defineAsyncComponent } from 'vue';
    import {
        api
    } from "@/axios/axios.js";
    import {
        toast
    } from "vue3-toastify";
    
    export default {
        components : {
            Upcoming : defineAsyncComponent(() => import('@/components/admin/calendar/components/DatesComponent.vue'))
        },
        data: () => ({
            overlay: false,
            type: 'month',
            types: ['month', 'week', 'day'],
            weekday: [0, 1, 2, 3, 4, 5, 6],
            value: [new Date()],
            events: [],
            futureServices: [],
            colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
            fecha: null,
            unavailableDates: [],
            dialog: false,
            dialogTitle: '',
            dialogText: '',
            selectedDate: null,
            selectedDateId: null,
            isDateUnavailable: false
        }),
        mounted() {
            this.fetchServices();
            this.fetchUnavailableDates();
        },
        methods: {
            fetchServices() {
                this.overlay = true;
                api.get('/schedule/getServices')
                    .then(response => {
                        if (response.data.success) {
                            this.addServicesToCalendar(response.data.services);
                            this.overlay = false;
                        } else {
                            console.error('Error fetching services:', response.data.message);
                        }
                    })
                    .catch(error => {
                        console.error('API error:', error);
                    });
            },
            fetchUnavailableDates() {
                api.get('/dates/get')
                    .then(response => {
                        if (response.data.success) {
                            this.unavailableDates = response.data.dates;
                            this.addUnavailableDatesToCalendar(response.data.dates);
                        } else {
                            console.error('Error fetching dates:', response.data.message);
                        }
                    })
                    .catch(error => {
                        console.error('API error:', error);
                    });
            },
            // addServicesToCalendar(services) {
            //     const events = services.map(service => {
            //         const scheduledTime = new Date(service.dates.scheduledTime);
            //         // Ajustar la hora a las 12:00 PM
            //         scheduledTime.setUTCHours(12, 0, 0, 0);
            //         return {
            //             title: service.user.name + ' ' + service.user.apellidoP + ' ' + service.user.apellidoM,
            //             start: scheduledTime,
            //             end: new Date(scheduledTime.getTime() + 3600000), // Añadir 1 hora
            //             color: this.colors[this.rnd(0, this.colors.length - 1)],
            //         };
            //     });
            //     this.events = [...this.events, ...events];
            // },
            addServicesToCalendar(services) {
                const currentDate = new Date(); // Obtener la fecha actual
                const futureServices = services.filter(service => {
                    const scheduledTime = new Date(service.dates.scheduledTime);
                    // Comparar si la fecha del servicio es dentro de 7 días a partir de hoy
                    const difference = scheduledTime.getTime() - currentDate.getTime();
                    const daysDifference = difference / (1000 * 3600 * 24);
                    return daysDifference >= 0 && daysDifference <= 7; // Filtrar servicios dentro de los próximos 7 días
                }).map(service => {
                    const scheduledTime = new Date(service.dates.scheduledTime);
                    // Ajustar la hora a las 12:00 PM
                    scheduledTime.setUTCHours(12, 0, 0, 0);
                    return {
                        ...service,
                        title: service.user.name + ' ' + service.user.apellidoP + ' ' + service.user.apellidoM, // Incluir todos los detalles del servicio
                        start: scheduledTime,
                        end: new Date(scheduledTime.getTime() + 3600000), // Añadir 1 hora
                        color: this.colors[this.rnd(0, this.colors.length - 1)],
                    };
                });
                this.futureServices = futureServices; // Asignar futureServices
                this.events = [...this.events, ...futureServices]; // Agregar los servicios filtrados a los eventos del calendario
            },


            addUnavailableDatesToCalendar(dates) {
                const unavailableEvents = dates.map(date => ({
                    title: 'No Disponible',
                    start: new Date(date.date),
                    end: new Date(new Date(date.date).getTime() + 3600000 * 2), // Añadir 1 día completo
                    color: 'red',
                    timed: false,
                }));
                this.events = [...this.events, ...unavailableEvents];
            },
            getEventColor(event) {
                return event.color;
            },
            rnd(a, b) {
                return Math.floor((b - a + 1) * Math.random()) + a;
            },
            onDateSelected(date) {
                const scheduled = new Date(date).toISOString().split('T')[0];
                const foundDate = this.unavailableDates.find(d => new Date(d.date).toISOString().split('T')[0] === scheduled);
                this.selectedDate = scheduled;
                this.isDateUnavailable = !!foundDate;
    
                if (foundDate) {
                    this.selectedDateId = foundDate._id;
                    this.dialogTitle = 'Habilitar Fecha';
                    this.dialogText = `La fecha ${scheduled} está marcada como no disponible. ¿Deseas habilitar esta fecha?`;
                } else {
                    this.dialogTitle = 'Deshabilitar Fecha';
                    this.dialogText = `La fecha ${scheduled} está disponible. ¿Deseas deshabilitar esta fecha?`;
                }
    
                this.dialog = true;
            },
            async onAccept() {
                const token = localStorage.getItem("token");
                if (this.isDateUnavailable) {
                    try {
                        const {
                            data
                        } = await api.delete(`/dates/remove/${this.selectedDateId}`, {
                            headers: {
                                'Authorization': 'Bearer ' + token,
                                'rol': 'admin',
                            },
                        });
                        console.log(data);
                        if (data.success) {
                            toast.success("Fecha habilitada correctamente");
                        } else {
                            toast.error(data.msg);
                        }
                    } catch (error) {
                        toast.error(error);
                        console.log(error);
                    }
                } else {
                    const datos = {
                        fecha: this.selectedDate
                    };
                    console.log('Deshabilitar fecha:', this.selectedDate);
                    const {
                        data
                    } = await api.post(`/dates/add`, datos, {
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'rol': 'admin',
                        },
                    });
                    console.log(data);
                    if (data.success) {
                        toast.success("Fecha deshabilitada correctamente");
                    } else {
                        toast.error(data.msg);
                    }
                }
                // Limpiar eventos de fechas no disponibles
                this.events = this.events.filter(event => event.title !== 'No Disponible');
                // Actualizar la lista de fechas no disponibles
                await this.fetchUnavailableDates();
                this.dialog = false;
            },
            onCancel() {
                this.dialog = false;
            },
        },
    };
    </script>
    