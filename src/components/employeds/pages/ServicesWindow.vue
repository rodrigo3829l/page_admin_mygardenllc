<template>
  <v-container>
    <v-card :title="$t('employedsPages.servicesWindow.welcomeString')" ${userStore.name} flat>
      <template v-slot:text>
        <v-text-field
          v-model="search"
          :label="$t('employedsPages.servicesWindow.welcomeString')"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
      </template>

      <v-data-table 
      :headers="headers" 
      :items="services" 
      :search="search">
      <template v-slot:item.actions="{ item }">
        
          <v-btn
            variant="text"
            @click="infoService(item)"
            color="green-darken-3"
            prepend-icon="mdi-pencil"
          >
            {{ ($t('employedsPages.servicesWindow.information')) }}
          </v-btn>

      </template>
      </v-data-table>
    </v-card>
  </v-container>
</template> 

<script>
import { api } from '@/axios/axios.js'
import { useUserStore } from '@/store/userStore.js'
import { i18n } from '@/main.js'
const userStore = useUserStore()
export default {
  data () {
    return {
      userStore,
      search: "",
      headers: [
        {
          align: "start",
          key: "service.name",
          title: i18n.global.t('employedsPages.servicesWindow.service'),
        },
        { key: "description", title: i18n.global.t('employedsPages.servicesWindow.description') },
        { key: "status", title: i18n.global.t('employedsPages.servicesWindow.status') },
        { title: i18n.global.t('employedsPages.servicesWindow.actions'), key: "actions", sortable: false, align : 'center' },
        // { key: "description", title: "Descripcion" },
        // { key: "status", title: "Estatus" },
        // { key: "quote", title: "Total" },
        // { key: "pending", title: "Pendiente" },
        // { key: "typeReserve", title: "Tipo de reserva" },
      ],
      services: [
        {
          service : 'servicio',
          description : 'Descipcio del sercviciop',
          status : 'En proceso'
        }

      ],
    }
  },
  methods : {
    async getServices () {
      try {
        const token = localStorage.getItem('token')
        const {data} = await api({
          method: 'GET',
          url : '/employed/services',
          headers: {
            'Authorization' : 'Bearer ' + token,
            'rol' : 'employed'
          },
        })
        console.log(data)
        this.services = data.services
      } catch (error) {
        console.log(error)
      }
    },
    infoService (item) {
      this.$router.push({name : 'infoservice', params : { id: item._id }})
    }
  },
  mounted () {
    this.getServices()
  }
}
</script>

<style scoped>

</style>