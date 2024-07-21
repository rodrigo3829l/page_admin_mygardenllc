<template>
<v-container>
    <!-- Título -->
    <v-row>
      <v-col cols="12" class="d-flex align-center">
        <v-btn prepend-icon="mdi-arrow-left" @click="redirectToComments" variant="text"></v-btn>
        <h2 class="ml-3">Comment Analytics</h2>
      </v-col>
    </v-row>

    <!-- Primera fila de análisis -->
    <v-row>
        <!-- Total de comentarios y porcentajes -->
        <v-col cols="12" md="4">
            <v-card class="pa-3">
                <p class="headline mb-3">Total Comments</p>
                <h2>{{ totalComments }}</h2>
                <v-row class="mt-3" dense>
                    <v-col cols="12" v-for="(stat, index) in commentStats" :key="index">
                        <v-chip class="ma-1" :color="stat.color" dark>
                            <span>{{ stat.percentage }}%</span>
                        </v-chip>
                        <span>{{ stat.label }}</span>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>

        <!-- Distribución de comentarios -->
        <v-col cols="12" md="4">
            <v-card class="pa-3">
                <p class="headline mb-3">Comment Distribution</p>
                <Bar :data="distributionChartData" :options="chartOptions"></Bar>
            </v-card>
        </v-col>

        <!-- Análisis de sentimientos -->
        <v-col cols="12" md="4">
            <v-card class="pa-3">
                <p class="headline mb-3">Sentiment Analysis</p>
                <Bar :data="sentimentChartData" :options="chartOptions"></Bar>
            </v-card>
        </v-col>
    </v-row>

    <v-overlay :value="loading" class="align-center justify-center">
        <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
</v-container>
</template>

  
<script>
import {
    Bar
} from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
} from 'chart.js';
import {
    api
} from '@/axios/axios.js';
import {
    toast
} from 'vue3-toastify';

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default {
    components: {
        Bar
    },
    data() {
        return {
            comments: [],
            totalComments: 0,
            goodComments: 0,
            badComments: 0,
            neutralComments: 0,
            commentStats: [{
                    label: 'Good',
                    color: '#2e7d32',
                    percentage: 0
                },
                {
                    label: 'Bad',
                    color: '#b71c1c',
                    percentage: 0
                },
                {
                    label: 'Neutral',
                    color: '#fbc02d',
                    percentage: 0
                }
            ],
            distributionChartData: {
                labels: ['Good', 'Bad', 'Neutral'],
                datasets: [{
                    label: 'Comments',
                    data: [0, 0, 0],
                    backgroundColor: ['#2e7d32', '#b71c1c', '#fbc02d'],
                    borderColor: ['#1b5e20', '#7f0000', '#f57f17'],
                    borderWidth: 1
                }]
            },
            sentimentChartData: {
                labels: [],
                datasets: [{
                    label: 'Comments per Month',
                    data: [],
                    backgroundColor: '#1e88e5',
                    borderColor: '#0d47a1',
                    borderWidth: 1
                }]
            },
            chartOptions: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Chart'
                    }
                }
            },
            loading: false
        };
    },
    methods: {
        async fetchComments() {
            this.loading = true;
            try {
                const {
                    data
                } = await api.get('/comment/get');
                if (data.success) {
                    this.comments = data.comments;
                    this.calculateStats();
                } else {
                    toast.error('Failed to fetch comments');
                }
            } catch (error) {
                toast.error('Error fetching comments');
            } finally {
                this.loading = false;
            }
        },
        calculateStats() {
            this.totalComments = this.comments.length;
            this.goodComments = this.comments.filter(comment => comment.rating >= 4).length;
            this.badComments = this.comments.filter(comment => comment.rating <= 2).length;
            this.neutralComments = this.comments.filter(comment => comment.rating > 2 && comment.rating < 4).length;

            this.commentStats[0].percentage = ((this.goodComments / this.totalComments) * 100).toFixed(2);
            this.commentStats[1].percentage = ((this.badComments / this.totalComments) * 100).toFixed(2);
            this.commentStats[2].percentage = ((this.neutralComments / this.totalComments) * 100).toFixed(2);

            this.distributionChartData = {
                labels: ['Good', 'Bad', 'Neutral'],
                datasets: [{
                    label: 'Comments',
                    data: [this.goodComments, this.badComments, this.neutralComments],
                    backgroundColor: ['#2e7d32', '#b71c1c', '#fbc02d'],
                    borderColor: ['#1b5e20', '#7f0000', '#f57f17'],
                    borderWidth: 1
                }]
            };

            const sentimentData = this.comments.reduce((acc, comment) => {
                const month = new Date(comment.date).toLocaleString('default', {
                    month: 'short'
                });
                if (!acc[month]) {
                    acc[month] = 0;
                }
                acc[month]++;
                return acc;
            }, {});

            this.sentimentChartData = {
                labels: Object.keys(sentimentData),
                datasets: [{
                    label: 'Comments per Month',
                    data: Object.values(sentimentData),
                    backgroundColor: '#1e88e5',
                    borderColor: '#0d47a1',
                    borderWidth: 1
                }]
            };

            console.log(this.sentimentChartData);
            console.log(this.distributionChartData);
        },
        redirectToComments() {
            this.$router.push({ name: 'comments' });
        },
    },
    created() {
        this.fetchComments();
    }
};
</script>

  
<style scoped>
.text-left {
    text-align: left;
}

.text-right {
    text-align: right;
}

.clickable {
    cursor: pointer;
}

.py-4 {
    padding-top: 16px;
    padding-bottom: 16px;
}

.v-list-item {
    padding: 8px;
}
</style>
