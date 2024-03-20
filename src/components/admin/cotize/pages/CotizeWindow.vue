<template>
  <v-container>
    <v-card title="Servicios" flat>
      <template v-slot:text>
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
      </template>

      <v-data-table :headers="headers" :items="services" :search="search">
        <template v-slot:item.actions="{ item }">
          <template v-if="item.status === 'quoting'">
            <!-- <v-icon size="small" @click="quoteItem(item)">
              mdi-currency-usd
            </v-icon> -->
            <v-btn
              variant="text"
              @click="quoteItem(item)"
              color="green-darken-3"
              prepend-icon="mdi-currency-usd"
            >
              cotizar
            </v-btn>
          </template>
          <template v-else>
            <!-- <v-icon size="small" @click="editItem(item)">
              mdi-pencil
            </v-icon> -->
            <v-btn
              variant="text"
              @click="editItem(item)"
              color="yellow-darken-3"
              prepend-icon="mdi-pencil"
            >
              Estatus
            </v-btn>
          </template>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>


  <script>
import { api } from "@/axios/axios.js";
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          align: "start",
          key: "_id",
          
          title: "Id",
        },
        { key: "user", title: "Usuario" },
        { key: "service", title: "Servicio" },
        { key: "description", title: "Descripcion" },
        { key: "status", title: "Estatus" },
        { key: "quote", title: "Total" },
        { key: "pending", title: "Pendiente" },
        { key: "typeReserve", title: "Tipo de reserva" },
        { title: "Acciones", key: "actions", sortable: false, align : 'center' },
      ],
      services: [
        {
          _id: "65df25a9a08828c91d39f160",
          user: "Rodrigo Del Angel Gerardo",
          service: "Garden Design",
          description: "Algo necesito",
          status: "finish",
          quote: 1218.93,
          pending: 0,
          typeReserve: "online",
          pay: {
            porcentage: 100,
            totalPay: true,
          },
        },
      ],
    };
  },
  methods: {
    quoteItem(item) {
        this.$router.push({name : 'quoteservice', params : { id: item._id }})
    },
    async getServices() {
      try {
        const {data} =  await api.get('/schedule/getServices')
        console.log(data.services);
        this.services = data.services

      }catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.getServices()
  }
};
</script>