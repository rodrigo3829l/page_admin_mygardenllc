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
                    <v-rating v-model="item.Calificacion.total"  color="yellow" readonly size="18" ></v-rating>
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
                    <v-btn variant="text" @click="editItem(item)" color="yellow-darken-3" prepend-icon="mdi-pencil">
                        Actualizar
                    </v-btn>
                    <v-btn variant="text" @click="deleteItem(item)" color="red-darken-3" prepend-icon="mdi-delete">
                        Eliminar
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
    
    <v-dialog v-model="statusDialog" width="auto" persistent>
        <v-card>
            <v-card-title>
                {{ ($t('admin.cotize.cotizeWindow.confirmString')) }}
            </v-card-title>
            <v-card-text>
                {{ ($t('admin.cotize.cotizeWindow.descriptionString')) }}<br>
                {{ ($t('admin.cotize.cotizeWindow.description1String')) }}
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn color="primary" @click="statusDialog = false">No</v-btn>
                <v-btn color="error" @click="changeStatus"> {{ ($t('admin.cotize.cotizeWindow.yesString')) }}</v-btn>
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
    } from 'vue3-toastify';
    import {
        i18n
    } from '@/main.js'
    export default {
        data() {
            return {
    
                search: "",
                headers: [
                    {
                        key: "name",
                        title: "Nombre"
                    },
                    // {
                    //     key: "description",
                    //     title: "Descripcion"
                    // },
                    {
                        key: "Calificacion.total",
                        title: "Rating"
                    },
                    {
                        key: "tipoDeServicio.tipo",
                        title: "Tipo de servicio"
                    },
                    {
                        title: 'Imagen',
                        key: 'img.secure_url'
                    },
                    {
                        key: "isUsable",
                        title: "Status"
                    },
                    {
                        title: i18n.global.t('admin.cotize.cotizeWindow.actionsString'),
                        key: "actions",
                        sortable: false,
                        align: 'center'
                    },
                ],
                services: [],
                item: {}
            };
        },
        methods: {
            async getServices() {
                try {
                    const {
                        data
                    } = await api.get('/services/get')
                    this.services = data.services
    
                } catch (error) {
                    console.log(error);
                }
            },
        },
        mounted() {
            this.getServices()
        }
    };
    </script>
    