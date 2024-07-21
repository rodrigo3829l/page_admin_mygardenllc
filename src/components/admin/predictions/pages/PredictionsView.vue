<template>
  <v-container>

    <!-- Primera fila -->
    <v-row>
      <!-- Columna 1 - Fecha de referencia -->
      <v-col cols="12" md="4">
        <v-card class="pa-3">
          <p class="headline mb-3">{{ ($t('admin.predictions.predictionsView.ChooseString')) }}</p>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="selectedReferenceYear"
                :items="referenceYears"
                :label="$t('admin.predictions.predictionsView.yearString')"
                dense
                @update:model-value="calculateMoths"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="selectedReferenceMonth"
                :items="(selectedReferenceYear === 2020) ? months2020 :months"
                :label="$t('admin.predictions.predictionsView.month')"
                dense
                @update:model-value="calculateMoths"
                item-title="text"
                item-value="value"
              ></v-select>
            </v-col>
          </v-row>
          <v-text-field
            v-model.number="referenceServiceCount"
            :label="$t('admin.predictions.predictionsView.servicesString')"
            type="number"
            disabled="true"
          ></v-text-field>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-3">
          <p class="headline mb-3">{{ ($t('admin.predictions.predictionsView.dateString')) }}</p>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="selectedCurrentYear"
                :items="currentYears"
                :label="$t('admin.predictions.predictionsView.yearString')"
                @update:model-value="calculateMothsCurrent"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="selectedCurrentMonth"
                :items="(selectedCurrentYear === 2020) ? months2020 :months"
                :label="$t('admin.predictions.predictionsView.month')"
                item-title="text"
                @update:model-value="calculateMothsCurrent"
                item-value="value"
              ></v-select>
            </v-col>
          </v-row>
          <v-text-field
            v-model.number="currentServiceCount"
            :label="$t('admin.predictions.predictionsView.servicesString')"
            type="number"
            disabled="true" 
          ></v-text-field>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-3">
          <p class="headline mb-3">{{ ($t('admin.predictions.predictionsView.prediction')) }}</p>
          <v-select
            v-model="selectedPredictionYear"
            :items="predictionYears"
            :label="$t('admin.predictions.predictionsView.yearString')"
            @update:model-value="addPredictionYear"
          ></v-select>
          
          <v-list v-if="selectedPredictionYears.length > 0" class="align-center justify-center">
            <v-list-item v-for="(year, index) in selectedPredictionYears" :key="index">
                <v-row class="fill-height">
                    <v-col cols="4">
                        <v-icon>mdi-calendar</v-icon> {{ year.year }}
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        v-model="year.month"
                        :items="months"
                        :label="$t('admin.predictions.predictionsView.month')"
                        dense
                        @update:model-value="calculateMothsYear(year)"
                        item-title="text"
                        item-value="value"
                      ></v-select>
                    </v-col>
                    <v-col cols="2">
                        <v-list-item-action>
                            <v-icon @click="removePredictionYear(index)">mdi-close</v-icon>
                        </v-list-item-action>
                    </v-col>
                </v-row>
            </v-list-item>
          </v-list>
          <!-- <v-chip
            v-for="(year, index) in selectedPredictionYears"
            :key="index"  
            closable
            @click:close="removePredictionYear(index)"
          >
            {{ year.year }}
          </v-chip> -->
        </v-card>
      </v-col>
    </v-row>

    <!-- Segunda fila - Tabla -->
    <v-row>
      <v-col cols="12">
        <v-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">{{ ($t('admin.predictions.predictionsView.dataString')) }}</th>
                <th class="text-left">{{ ($t('admin.predictions.predictionsView.serviceString')) }}</th>
                <th class="text-left">{{ ($t('admin.predictions.predictionsView.timeString')) }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ ($t('admin.predictions.predictionsView.reference')) }}</td>
                <td>{{ referenceServiceCount }} servicios, despues de {{ calculateDiference(selectedReferenceYear, selectedReferenceMonth) }} meses desde marzo del 2020</td>
                <td>{{ monthDiferenceReference }} {{ ($t('admin.predictions.predictionsView.monthString')) }} {{ getMonthName(selectedReferenceMonth) }} del {{ selectedReferenceYear }}</td>
              </tr>
              <tr>
                <td>{{ ($t('admin.predictions.predictionsView.currentDate')) }}</td>
                <td>{{ currentServiceCount }} servicios, despues de {{ calculateDiferenceMonth(selectedCurrentYear, selectedCurrentMonth, selectedReferenceYear, selectedReferenceMonth) }} meses desde {{ getMonthName(selectedReferenceMonth) }} del {{ selectedReferenceYear }}</td>
                <td>{{ monthDiferenceCurrent }} {{ ($t('admin.predictions.predictionsView.monthString')) }},  {{ getMonthName(selectedCurrentMonth) }} del {{ selectedCurrentYear }}</td>
              </tr>
              <tr v-for="(year, index) in selectedPredictionYears" :key="index">
                <td> {{ ($t('admin.predictions.predictionsView.predictionString')) }} {{ index + 1 }}</td>
                <td>{{ year.prediction }}
                  servicios, despues de
                  {{ (index === 0 )
                  ?  `${calculateDiferenceMonth(year.year, year.month, selectedCurrentYear, selectedCurrentMonth)} meses desde  ${getMonthName(selectedCurrentMonth)} del ${selectedCurrentYear} `
                  :  `${calculateDiferenceMonth(year.year, year.month, selectedPredictionYears[index - 1].year, selectedPredictionYears[index - 1].month)} meses desde  ${getMonthName(selectedPredictionYears[index - 1].month)} del ${selectedPredictionYears[index - 1].year} `
                  }}
                </td>
                <td>{{ year.diference }} {{ ($t('admin.predictions.predictionsView.monthString')) }}, {{ year.text }}</td>
              </tr>
            </tbody>
          </template>
        </v-table>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn color="green-darken-4" block @click="calculatePrediction">{{ ($t('admin.predictions.predictionsView.calculateString')) }}</v-btn>
      </v-col>
    </v-row>
    <br>
    <v-divider></v-divider><br>
    <Bar id="my-chart-id"  :options="chartOptions" :data="chartData" />
  </v-container>
  
  
  <v-overlay :model-value="overlay" class="align-center justify-center">
        <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
import { toast } from 'vue3-toastify';
export default {
  components: { Bar },
 
  data() {
    return {
      startYear: 2022,
      startMonth: 3,
      endYear: 2023,
      endMonth: 6,
      chartData: {
          labels: [],
          datasets: [
            { 
              label: 'Servicios',
              data: [],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)', 
              borderWidth: 1, 
            }
          ]
      },
      chartOptions: {
          responsive: true,
          scales: {
              y: {
                  beginAtZero: true
              }
          },
          plugins: {
              legend: {
                  display: true,
                  position: 'top',
              },
              title: {
                  display: true, // Muestra el título
                  text: 'Grafica de servicios de My Garden LLC'
              }
          }
      },
      overlay :  false,
      referenceYears : Array.from({ length: new Date().getFullYear() - 2019 }, (_, i) => 2020 + i),
      currentYears : Array.from({ length: new Date().getFullYear() - 2019 }, (_, i) => 2020 + i),
      predictionYears: Array.from({ length: 17 }, (_, i) => 2024 + i),

      selectedReferenceYear: null,
      selectedReferenceMonth: null,
      referenceServiceCount: null,
      monthDiferenceReference : null,

      selectedCurrentYear: null,
      selectedCurrentMonth: null,
      currentServiceCount: null,
      monthDiferenceCurrent : null,

      selectedPredictionYear: null,
      selectedPredictionYears: [],

      months: [
        { text: 'Enero', value: 1 },
        { text: 'Febrero', value: 2 },
        { text: 'Marzo', value: 3 },
        { text: 'Abril', value: 4 },
        { text: 'Mayo', value: 5 },
        { text: 'Junio', value: 6 },
        { text: 'Julio', value: 7 },
        { text: 'Agosto', value: 8 },
        { text: 'Septiembre', value: 9 },
        { text: 'Octubre', value: 10 },
        { text: 'Noviembre', value: 11 },
        { text: 'Diciembre', value: 12 }
      ],
      months2020: [
        { text: 'Marzo', value: 3 },
        { text: 'Abril', value: 4 },
        { text: 'Mayo', value: 5 },
        { text: 'Junio', value: 6 },
        { text: 'Julio', value: 7 },
        { text: 'Agosto', value: 8 },
        { text: 'Septiembre', value: 9 },
        { text: 'Octubre', value: 10 },
        { text: 'Noviembre', value: 11 },
        { text: 'Diciembre', value: 12 }
      ],
    };
  },
  methods: {
    calculateNumber(año, mes) {
      if(año === 2020){
        switch(mes){
          case 3:
            return 0
          case 4:
            return 4
          case 5:
            return 8
          case 6:
            return 14
          case 7:
            return 28
          case 8:
            return 23
          case 9:
            return 26
          case 10:
            return 31
          case 11:
            return 37
          case 12:
            return 41
        }
      }
      else{
        var base = 20;
        var diferencia_año = año - 2020;
        var factor_año = diferencia_año * 25;
        var resultado = base + factor_año + mes;
        return resultado;
      }
    },
    calculateMothsYear (year){
      const march2020 = new Date(2020, 2); 
      const providedDate = new Date(year.year, year.month - 1); 
      const differenceInMilliseconds = providedDate - march2020;
      const differenceInMonths = differenceInMilliseconds / (1000 * 60 * 60 * 24 * 30.44); 
      year.diference = ( Math.round(differenceInMonths));
      year.text = `${this.getMonthName(year.month)} del ${year.year}`
    },
    addPredictionYear() {
      if (this.selectedPredictionYear && !this.selectedPredictionYears.includes(this.selectedPredictionYear)) {

        this.selectedPredictionYears.push({
          year : this.selectedPredictionYear,
          // text : `${this.getMonthName} ${this.selectedPredictionYear}`,
          month : '',
          // diference : this.calculateDiference(this.selectedPredictionYear, month),
          prediction : 0
        });
      }
    },
    removePredictionYear(index) {
      this.selectedPredictionYears.splice(index, 1);
      console.log(this.selectedPredictionYears)
    },
    getMonthName(month) {
      if(month){
        return this.months[month - 1].text;
      }
    },
    calculateDiference(year, value){
      const march2020 = new Date(2020, 2); 
      const providedDate = new Date(year, value - 1); 
      const differenceInMilliseconds = providedDate - march2020;
      const differenceInMonths = differenceInMilliseconds / (1000 * 60 * 60 * 24 * 30.44); 
      return ( Math.round(differenceInMonths));
    },
    calculateDiferenceMonth(year, value, reference, month){
      const march2020 = new Date(reference, month -1); 
      const providedDate = new Date(year, value - 1); 
      const differenceInMilliseconds = providedDate - march2020;
      const differenceInMonths = differenceInMilliseconds / (1000 * 60 * 60 * 24 * 30.44); 
      return ( Math.round(differenceInMonths));
    },
    calculateMoths(){
      if(this.selectedReferenceYear && this.selectedReferenceMonth){
        this.monthDiferenceReference = this.calculateDiference(this.selectedReferenceYear, this.selectedReferenceMonth)
        this.referenceServiceCount = this.calculateNumber(this.selectedReferenceYear, this.selectedReferenceMonth)
      }
    },
    calculateMothsCurrent() {
      if(this.selectedCurrentYear && this.selectedCurrentMonth){
        this.monthDiferenceCurrent = this.calculateDiference(this.selectedCurrentYear, this.selectedCurrentMonth)
        this.currentServiceCount = this.calculateNumber(this.selectedCurrentYear, this.selectedCurrentMonth)
      }
    },
    calculatePrediction(){
      this.overlay = true
      const kValue = this.calculateK(this.currentServiceCount, this.monthDiferenceCurrent)
      
      setTimeout(() =>{
        this.selectedPredictionYears.forEach(year => {
          year.prediction = this.calculateServices(year.diference, kValue)
        });
        this.generateData()
        this.overlay = false
        toast.success('Se calcularon correctamente los servicios')
      }, 500)
    },
    calculateK(services, time){
      const up = (this.referenceServiceCount === 0)? Math.log(services) : (Math.log(services / this.referenceServiceCount))
      const down = time - this.monthDiferenceReference
      return up/down
    },
    generateData() {
      const labels = [];
      const data = [];
      let currentDate = new Date(this.selectedReferenceYear, this.selectedReferenceMonth - 1); 

      while (currentDate.getFullYear() < this.selectedCurrentYear || (currentDate.getFullYear() === this.selectedCurrentYear && currentDate.getMonth() <= this.selectedCurrentMonth - 1)) {
          labels.push(`${this.getMonthName(currentDate.getMonth() + 1)} ${currentDate.getFullYear()}`);
          data.push(this.calculateNumber(currentDate.getFullYear(), (currentDate.getMonth() + 1)));
          currentDate.setMonth(currentDate.getMonth() + 1);
      }
      const kValue = this.calculateK(this.currentServiceCount, this.monthDiferenceCurrent);
      const lastPrediction = this.selectedPredictionYears[this.selectedPredictionYears.length - 1];

      const predictionLabels = [];
      const predictionData = [];
      let predictionDate = new Date(lastPrediction.year, lastPrediction.month - 1); 
      let referendeDate = new Date(this.selectedCurrentYear, this.selectedCurrentMonth)
      // Calcular los labels y datos de predicción
      while (referendeDate.getFullYear() < predictionDate.getFullYear() || (referendeDate.getFullYear() === predictionDate.getFullYear() && referendeDate.getMonth() <= predictionDate.getMonth())) {
          predictionLabels.push(`${this.getMonthName(referendeDate.getMonth() + 1)} ${referendeDate.getFullYear()}`);
          const difference = this.calculateDiference(referendeDate.getFullYear(), referendeDate.getMonth() + 1);
          predictionData.push(this.calculateServices(difference, kValue));
          referendeDate.setMonth(referendeDate.getMonth() + 1);
      }

      this.chartData = {
          labels: labels.concat(predictionLabels), 
          datasets: [
            { 
              label: 'Servicios',
              data: data.concat(predictionData),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            }
          ] 
      };
      console.log(this.chartData)
  },
    calculateServices(time, kValue){
      const exponent = (time - this.monthDiferenceReference) * kValue
      const value =(this.referenceServiceCount === 0)? (Math.E ** (exponent)) : (this.referenceServiceCount * (Math.E ** (exponent)))
      const roundedValue = Math.round(value);
      return roundedValue; 
    },
    
  },
};
</script>
