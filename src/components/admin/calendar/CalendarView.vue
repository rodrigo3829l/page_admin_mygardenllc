<template>
<v-overlay :model-value="overlay" class="align-center justify-center">
    <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
</v-overlay>
<v-container>
    <v-sheet class="d-flex" height="54" tile>
        <!-- <v-select v-model="type" :items="types" class="ma-2" label="View Mode" variant="outlined" dense hide-details></v-select>
        <v-select v-model="weekday" :items="weekdays" class="ma-2" label="weekdays" variant="outlined" dense hide-details></v-select> -->
    </v-sheet>
    <v-sheet>
        <v-calendar ref="calendar" v-model="value" :events="events" :type="type" :weekdays="weekday"></v-calendar>
    </v-sheet>
</v-container>
</template>

<script>
import {
    useDate
} from 'vuetify'
import {
    api
} from "@/axios/axios.js"

export default {
    data: () => ({
        overlay: false,
        type: 'month',
        types: ['month', 'week', 'day'],
        weekday: [0, 1, 2, 3, 4, 5, 6],
        weekdays: [{
                title: 'Sun - Sat',
                value: [0, 1, 2, 3, 4, 5, 6]
            },
            {
                title: 'Mon - Sun',
                value: [1, 2, 3, 4, 5, 6, 0]
            },
            {
                title: 'Mon - Fri',
                value: [1, 2, 3, 4, 5]
            },
            {
                title: 'Mon, Wed, Fri',
                value: [1, 3, 5]
            },
        ],
        value: [new Date()],
        events: [],
        colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
        titles: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    }),
    mounted() {
        this.fetchServices()
    },
    methods: {
        fetchServices() {
            this.overlay = true
            api.get('/schedule/getServices')
                .then(response => {
                    if (response.data.success) {
                        this.addServicesToCalendar(response.data.services)
                        this.overlay = false
                    } else {
                        console.error('Error fetching services:', response.data.message)
                    }
                })
                .catch(error => {
                    console.error('API error:', error)
                })
        },
        addServicesToCalendar(services) {
            const events = services.map(service => ({
                title: service.user,
                start: new Date(service.dates.scheduledTime),
                end: new Date(new Date(service.dates.scheduledTime).getTime() + 3600000), // Añadir 1 hora
                color: this.colors[this.rnd(0, this.colors.length - 1)],
            }))
            this.events = [...this.events, ...events]
        },
        getEventColor(event) {
            return event.color
        },
        rnd(a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
    },
}
</script>
