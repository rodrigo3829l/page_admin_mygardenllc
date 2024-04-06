<template>
    <v-container style="height: 400px;" v-if="!loaded">
        <v-row class="fill-height" align-content="center" justify="center">
            <v-col class="text-subtitle-1 text-center" cols="12">
                {{ ($t('admin.cotize.infoService.infoServiceString')) }}
            </v-col>
            <v-col cols="6">
                <v-progress-linear color="green-darken-3" indeterminate rounded height="6"></v-progress-linear>
            </v-col>
        </v-row>
    </v-container>
    <v-container v-else>
        <v-row>
            <v-col cols="12" md="6">
                <v-img
                    :src="'https://res.cloudinary.com/dui4i9f4e/image/upload/v1697990498/logos/p3xyl9xetmmg6vlamwkt.jpg'"
                    height="300px" class="white--text align-end" :alt="'Service Image'">
                    <v-card-title class="text-h4 text-center">{{ serviceName }}</v-card-title>
                </v-img>
            </v-col>
            <v-col cols="12" md="6">
                <v-list lines="two">
                    <h2>{{ ($t('admin.cotize.infoService.detailsString')) }}</h2>
                    <v-list-item>
                        <v-list-item-title>{{ ($t('admin.cotize.infoService.descriptionString')) }}</v-list-item-title>
                        <v-list-item-subtitle>{{ serviceDescription }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>{{ ($t('admin.cotize.infoService.totalString')) }}</v-list-item-title>
                        <v-list-item-subtitle>${{ servicePrice }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>{{ ($t('admin.cotize.infoService.earringString')) }}</v-list-item-title>
                        <v-list-item-subtitle>${{ pending }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>{{ ($t('admin.cotize.infoService.statusString')) }}</v-list-item-title>
                        <v-list-item-subtitle>{{ status }}</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <v-row v-if="status !== 'quoting'">
            <v-col cols="12" md="6">
                <h2>{{ ($t('admin.cotize.infoService.productsString')) }}</h2>
                <v-table density="compact">
                    <thead>
                        <tr>
                            <th class="text-left">{{ ($t('admin.cotize.infoService.products')) }}</th>
                            <th class="text-left">{{ ($t('admin.cotize.infoService.amount')) }}</th>
                            <th class="text-left">{{ ($t('admin.cotize.infoService.total')) }}</th>
                            <!-- <th class="text-left">{{ $t('profile.pages.infoMyService.productString') }}</th>
                            <th class="text-left">{{ $t('profile.pages.infoMyService.quantityString') }}</th>
                            <th class="text-left">{{ $t('profile.pages.infoMyService.totalString') }}</th> -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in productList" :key="product.name">
                            <td>{{ product.product }}</td>
                            <td>{{ product.quantity }}</td>
                            <td>{{ product.total }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
            <v-col cols="12" md="6">
                <v-row>
                    <v-col cols="12" md="6">
                        <v-list>
                            <!-- <h2>{{ $t('profile.pages.infoMyService.costBreakdownString') }}</h2> -->
                            <h2>{{ ($t('admin.cotize.infoService.costsString')) }}</h2>
                            
                            <v-list-item>
                                <v-list-item-title>{{ ($t('admin.cotize.infoService.handWork')) }}</v-list-item-title>
                                <!-- <v-list-item-title>{{ $t('profile.pages.infoMyService.laborString')
                                    }}</v-list-item-title> -->
                                <v-list-item-subtitle>${{ laborCost }}</v-list-item-subtitle>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-title>{{ ($t('admin.cotize.infoService.machinery')) }}</v-list-item-title>
                                <!-- <v-list-item-title>{{ $t('profile.pages.infoMyService.machineryString')}}</v-list-item-title> -->
                                <v-list-item-subtitle>${{ machineryCost }}</v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-list>
                            <!-- <h2>{{ $t('profile.pages.infoMyService.assignedEmployeesString') }}</h2> -->
                            <h2>{{ ($t('admin.cotize.infoService.employee')) }}</h2>
                            <v-list-item v-for="(employee, index) in employeeList" :key="index">
                                <v-list-item-title>{{ employee }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import { api } from '@/axios/axios.js'

export default {
    data() {
        return {
            serviceName: '',
            serviceDescription: '',
            servicePrice: 0,
            status: '',
            productList: [],
            laborCost: 0,
            machineryCost: 0,
            employeeList: [],
            loaded: false,
        }
    },
    methods: {
        async getService() {
            try {
                const { data } = await api.get(`/schedule/scheduleservice/${this.$route.params.id}`)
                console.log(data)
                this.serviceName = data.newService.service
                this.pending = data.newService.pending
                this.serviceDescription = data.newService.description
                this.status = data.newService.status
                this.servicePrice = data.newService.quote
                if (data.newService.status !== 'quoting') {
                    this.productList = data.newService.products
                    this.laborCost = data.newService.additionalCosts.labor
                    this.machineryCost = data.newService.additionalCosts.machinery
                    this.employeeList = data.newService.employeds
                    this.porcentage = data.newService.pay.porcentage
                }
                this.loaded = true
                console.log(data)
            } catch (error) {
                console.log(error)
            }
        },
    },
    created() {
        this.getService()
    },
}
</script>

<style scoped>
.text-h4 {
    color: rgb(255, 255, 255);
}
</style>