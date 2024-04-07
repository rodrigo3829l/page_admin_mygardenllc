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
                :items="months"
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
                :items="months"
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
          <v-chip
            v-for="(year, index) in selectedPredictionYears"
            :key="index"  
            closable
            @click:close="removePredictionYear(index)"
          >
            {{ year.year }}
          </v-chip>
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
                <td>{{ referenceServiceCount }}</td>
                <td>{{ monthDiferenceReference }} {{ ($t('admin.predictions.predictionsView.monthString')) }} {{ getMonthName(selectedReferenceMonth) }} del {{ selectedReferenceYear }}</td>
              </tr>
              <tr>
                <td>{{ ($t('admin.predictions.predictionsView.currentDate')) }}</td>
                <td>{{ currentServiceCount }}</td>
                <td>{{ monthDiferenceCurrent }} {{ ($t('admin.predictions.predictionsView.monthString')) }},  {{ getMonthName(selectedCurrentMonth) }} del {{ selectedCurrentYear }}</td>
              </tr>
              <tr v-for="(year, index) in selectedPredictionYears" :key="index">
                <td> {{ ($t('admin.predictions.predictionsView.predictionString')) }} {{ index + 1 }}</td>
                <td>{{ year.prediction }}</td>
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
  
  </v-container>
  <v-overlay :model-value="overlay" class="align-center justify-center">
        <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
</template>

<script>
import { toast } from 'vue3-toastify';
export default {
  data() {
    return {
      overlay :  false,
      referenceYears: Array.from({ length: 19 }, (_, i) => 2020 + i),
      currentYears: Array.from({ length: 19 }, (_, i) => 2020 + i),
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
      ]
    };
  },
  methods: {
    addPredictionYear() {
      if (this.selectedPredictionYear && !this.selectedPredictionYears.includes(this.selectedPredictionYear)) {

        this.selectedPredictionYears.push({
          year : this.selectedPredictionYear,
          text : `Diciembre del ${this.selectedPredictionYear}`,
          diference : this.calculateDiference(this.selectedPredictionYear, 12),
          prediction : 0
        });
      }
    },
    removePredictionYear(index) {
      this.selectedPredictionYears.splice(index, 1);
      console.log("aqui se elimina")
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
    calculateMoths(){
      if(this.selectedReferenceYear && this.selectedReferenceMonth){
        this.monthDiferenceReference = this.calculateDiference(this.selectedReferenceYear, this.selectedReferenceMonth)
      }
    },
    calculateMothsCurrent() {
      if(this.selectedCurrentYear && this.selectedCurrentMonth){
        this.monthDiferenceCurrent = this.calculateDiference(this.selectedCurrentYear, this.selectedCurrentMonth)
      }
    },
    calculatePrediction(){
      this.overlay = true
      const kValue = this.calculateK(this.currentServiceCount, this.monthDiferenceCurrent)
      
      setTimeout(() =>{
        this.selectedPredictionYears.forEach(year => {
          year.prediction = this.calculateServices(year.diference, kValue)
        });
        this.overlay = false
        toast.success('Se calcularon correctamente los servicios')
      }, 1000)
    },
    calculateK(services, time){
      const up = (this.referenceServiceCount === 0)? Math.log(services) : (Math.log(services / this.referenceServiceCount))
      const down = time - this.monthDiferenceReference
      return up/down
    },
    calculateServices(time, kValue){
      const exponent = (time - this.monthDiferenceReference) * kValue
      const value =(this.referenceServiceCount === 0)? (Math.E ** (exponent)) : (this.referenceServiceCount * (Math.E ** (exponent)))
      const roundedValue = Math.round(value);
      return roundedValue; 
    }
  }
};
</script>
