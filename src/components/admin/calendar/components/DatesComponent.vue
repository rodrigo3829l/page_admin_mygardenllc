<template>
    <v-container class="pa-0" fluid>
      <v-row class="align-center">
        <v-col cols="auto">
          <v-avatar size="50">
            <v-img src="https://res.cloudinary.com/dltytaqui/image/upload/v1714668117/cgz8grqzzlumeia6wt1j.png"></v-img>
          </v-avatar>
        </v-col>
        <v-col>
          <v-row class="d-flex align-center">
            <v-col class="pa-0">
              <span class="font-weight-bold">{{ service.user.name }} {{ service.user.apellidoP }} {{ service.user.apellidoM }}</span>
              <div class="grey--text">{{ service.user.direccion.estado }} {{ service.user.direccion.ciudad }} {{ service.user.direccion.calle }} {{ service.user.direccion.numCasa }}</div>
            </v-col>
            <v-col cols="auto">
              <v-btn icon="mdi-information" variant="text" @click="showInfo">
                
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    props: {
      service: {
        type: Object,
        required: true,
      },
    },
    methods: {
      showInfo() {
        // Lógica para mostrar información adicional del usuario
        this.$router.push({name : 'infoservice', params : { id: this.service._id }})
        console.log('Mostrar información del usuario:', this.service);
      },
    },
  };
  </script>
  