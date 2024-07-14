<template>
  <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>
  <v-container>
    <v-card :title="$t('admin.cotize.cotizeWindow.serviceString')" flat>
      <template v-slot:text>
        <v-text-field
          v-model="search"
          :label="$t('admin.cotize.cotizeWindow.searchString')"
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
              {{ ($t('admin.cotize.cotizeWindow.quoteString')) }}
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
            {{ ($t('admin.cotize.cotizeWindow.statusString')) }}
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
            {{ ($t('admin.cotize.cotizeWindow.informationString')) }}
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
import { api } from "@/axios/axios.js";
import { toast } from 'vue3-toastify';
import { i18n } from '@/main.js'
export default {
  data() {
    return {
      items: [
        {
          title: 'Home',
          disabled: true,
          href: '/admin/quote',
        },
        
      ],
      statusDialog : false,
      search: "",
      headers: [
        
        { key: "user.name", title: i18n.global.t('admin.cotize.cotizeWindow.userString') },
        // { key: "service.name", title: i18n.global.t('admin.cotize.cotizeWindow.serviceString') },
        { key: "description", title: i18n.global.t('admin.cotize.cotizeWindow.desString') },
        { key: "status", title: i18n.global.t('admin.cotize.cotizeWindow.statusString') },
        // { key: "quote", title: i18n.global.t('admin.cotize.cotizeWindow.quote') },
        { key: "pending", title: i18n.global.t('admin.cotize.cotizeWindow.pendingString') },
        // { key: "typeReserve", title: i18n.global.t('admin.cotize.cotizeWindow.typeReserveString') },
        { title: i18n.global.t('admin.cotize.cotizeWindow.actionsString'), key: "actions", sortable: false, align : 'center' },
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
          toast.success(this.$t('admin.cotize.cotizeWindow.changeString'))
        }else{
          toast.warning(this.$t('admin.cotize.cotizeWindow.updateString'))
        }
      } catch (error) {
        toast.error(this.$t('admin.cotize.cotizeWindow.mistakeString'))
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