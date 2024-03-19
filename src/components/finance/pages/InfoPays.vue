<template>
  <v-container>
    <v-card
    title="Pagos"
    flat
  >
    <template v-slot:text>        
      <v-text-field 
        label="Buscar por usuario"
        v-model="name" 
        class="ma-2" 
        type="text"
        hide-details
      ></v-text-field>
      <v-select
        label="Buscar por tipo de paago"
        v-model="type"
        class="ma-2"
        placeholder="Tipo de pago"
        :items="['card', 'cash']"
        hide-details
      ></v-select>
      <v-text-field
        v-model="fecha"
        class="ma-2"
        label="Buscar por fecha"
        placeholder="Fecha"
        type="date"
        hide-details
      ></v-text-field>
    </template>

    <v-data-table
      
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :search="search"
      item-value="name"
      @update:options="loadItems"
      :items-length="totalItems"
      :loading="loading"

    >
    <template v-slot:item.actions="{ item }">
      <v-icon
        class="me-2"
        size="small"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
  </v-card>
  </v-container>
  <v-dialog v-model="showEditDialog" width="auto" persistent>
    <v-card>
    <v-card-title>Editar Monto</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="monto"
        label="Monto"
        type="number"
        outlined
      ></v-text-field>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn color="success" @click="showEditDialog = false">Cancelar</v-btn>
      <v-btn color="error" @click="editPay">Editar</v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>

  <v-dialog 
    v-model="showDeleteDialog" 
    width="auto"
    persistent
  >
    <v-card>
      <v-card-title>
        Confirmar eliminacion
      </v-card-title>
      <v-card-text>
        ¿Está seguro de que desea eliminar el pago?<br>
        Tenga en cuenta que esta accion no se puede revertir
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="showDeleteDialog = false">No</v-btn>
        <v-btn color="error" @click="deletePay">Sí, estoy seguro</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-overlay
      :model-value="overlay"
      class="align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>

</template>

<script>
import { api } from '@/axios/axios.js';
import { toast } from 'vue3-toastify';
const FakeAPI = {
    async fetch ({ page, itemsPerPage, sortBy, search, pays }) {
      return new Promise(resolve => {
        
        // setTimeout(() => {
          const start = (page - 1) * itemsPerPage
          const end = start + itemsPerPage
          const items = pays.slice().filter(item => {
            if (search.name && !item.user.toLowerCase().includes(search.name.toLowerCase())) {
              console.log('entro en el if de si incluye')
              return false
            }

            return true
          })

          if (sortBy.length) {
            const sortKey = sortBy[0].key
            const sortOrder = sortBy[0].order
            items.sort((a, b) => {
              const aValue = a[sortKey]
              const bValue = b[sortKey]
              return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
            })
          }

          const paginated = items.slice(start, end)
          const item = JSON.parse(JSON.stringify(paginated))
          resolve({ items: item, total: items.length })
        // }, 500)
      })
    },
  }

  export default {
    data () {
      return {
        itemsPerPage: 9,
        serverItems : [],
        search: '',
        totalItems : 0,
        loading : true,
        headers: [
          {
            align: 'start',
            key: '_id',
            sortable: false,
            title: 'Pagos realizados',
          },
          { key: 'date', title: 'Fecha de pago' },
          { key: 'user', title: 'Usuario' },
          { key: 'amount', title: 'Monto' },
          { key: 'service', title: 'Servicio pagado' },
          { key: 'description', title: 'descripcion' },
          { key: 'type', title: 'Tipo de pago' },
          { title: 'Actions', key: 'actions', sortable: false },
        ],
        pays : [
          
        ],
        name : '',
        type : '',
        fecha : '',
        showDeleteDialog : false,
        idItem : '',
        overlay : false,
        showEditDialog : false,
        itemData : {},
        monto : 0
      }
    },
    methods : {
      editItem (item){
        this.idItem = item._id
        this.monto = item.amount
        this.showEditDialog =  true
      },
      deleteItem(item){
        this.idItem = item._id
        this.showDeleteDialog = true
      },
      async loadItems ({ page, itemsPerPage, sortBy }) {
        this.loading = true;
        const pays = this.pays.length === 0? await this.getPays() : this.pays
        FakeAPI.fetch({ 
          page, 
          itemsPerPage, 
          sortBy, 
          search: { 
            name: this.name, 
          }, 
          pays // Pasando 'this.pays' como parte de los parámetros
        })
        .then(({ items, total }) => {
          this.serverItems = items;
          this.totalItems = total;
          this.loading = false;
        });
      },
      async editPay (){
        this.showEditDialog = false
        this.overlay = true
        try {
          const token = localStorage.getItem('token')
          const datos = {
            amount : this.monto
          }
          const {data} = await api({
              method : 'PUT',
              url: `/pays/updatePay/${this.idItem}`,
              headers : {
                'Authorization' : 'Bearer ' + token,
                'rol' : 'finance',
              },
              data : datos
            })
            if(!data.success){
              toast.error('No se pudo actualizar el pago')
            }else{
              toast.success('Pago actualizado con exito')
            }
        } catch (error) {
          console.log(error)
        }finally{
          this.idItem = ''
          this.monto = 0
          this.overlay = false
          this.getPays()
        }
      },
      async getPays() {
        try {
          const token = localStorage.getItem('token')
          const {data} = await api({
                method: 'GET',
                url : '/pays/get',
                headers: {
                    'Authorization' : 'Bearer ' + token,
                    'rol' : 'finance'
                },
            })
            this.pays = data.pays
            this.serverItems = data.pays
            this.itemsPerPage = data.pays.length
            this.totalItems = data.pays.length
            return data.pays
        } catch (error) {
          alert(error.response.data.error)
          console.log(error)
        }
      },
      async deletePay(){
        this.overlay = true
        this.showDeleteDialog =  false
        try {
            console.log(this.idItem)
            const token = localStorage.getItem('token')
            const {data} = await api({
              method : 'DELETE',
              url: `/pays/deletePay/${this.idItem}`,
              headers : {
                'Authorization' : 'Bearer ' + token,
                'rol' : 'finance',
              },
            })
            console.log(data)
            if(!data.success){
              toast.error('No se pudo eliminar el pago')
            }else{
              toast.success('Pago eliminado con exito')
            }
        } catch (error) {
          console.log(error)
        } finally {
          this.idItem = ''
          this.overlay = false
          this.getPays()
        }
      }
    },
    mounted() {

      // this.getPays()
    //   .then(() => {
    // this.loadItems()})
    },
    watch : {
      name () {
        this.search = String(Date.now())
      },
    }
  }
</script>