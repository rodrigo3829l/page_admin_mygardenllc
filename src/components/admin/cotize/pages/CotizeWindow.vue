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
          <template v-else-if="item.status === 'pay' || item.status === 'development'">
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

          <template v-else>
            <!-- <v-icon size="small" @click="editItem(item)">
              mdi-pencil
            </v-icon> -->
            <v-btn
              variant="text"
              @click="infoService(item)"
              color="green-darken-3"
              prepend-icon="mdi-pencil"
            >
              Informacion
            </v-btn>
          </template>

        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <v-dialog 
    v-model="statusDialog" 
    width="auto"
    persistent
  >
    <v-card>
      <v-card-title>
        Confirmar cambio
      </v-card-title>
      <v-card-text>
        ¿Está seguro de que desea cambiar el status del servicio?<br>
        Tenga en cuenta que esta accion es irreversible
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="statusDialog = false">No</v-btn>
        <v-btn color="error" @click="changeStatus">Sí, estoy seguro</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>


  <script>
import { api } from "@/axios/axios.js";
import { toast } from 'vue3-toastify';
export default {
  data() {
    return {
      statusDialog : false,
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
      services: [],
      item : {}
    };
  },
  methods: {
    quoteItem(item) {
        this.$router.push({name : 'quoteservice', params : { id: item._id }})
    },
    infoService(item) {
      console.log(item._id)
        this.$router.push({name : 'infoservice', params : { id: item._id }})
    },
    editItem (item){
      this.item = item
      this.statusDialog = true
    },
    async changeStatus(){
      console.log(this.item.status)
      try {
        let status = ''
        if(this.item.status === 'pay'){
          status = 'development'
        }else{
          status = 'finish'
        }
        console.log(status)
        const token = localStorage.getItem('token')
        const { data } = await api({
            method: 'PUT',
            url: `/schedule/change/${this.item._id}`,
            headers: {
                'Authorization': 'Bearer ' + token,
                'rol': 'admin'
            },
            data : {status}
        })
        console.log(data)
        if(data.success){
          toast.success('Se cambio el status con exito')
        }else{
          toast.warning('No se pudo actualizar el status')
        }
      } catch (error) {
        toast.error('Ocurrio un error al cambiar el status del servicio')
        console.log(error)
      } finally {
        this.statusDialog = false
        this.getServices()
      }
    },
    async getServices() {
      try {
        const {data} =  await api.get('/schedule/getServices')
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