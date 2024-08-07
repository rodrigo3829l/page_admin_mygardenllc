<template>
  <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>
    <v-container>
      <v-card title="Preguntas y respuestas" flat>
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
  
        <v-data-table :headers="headers" :items="questions" :search="search">
          <template v-slot:item.actions="{ item }">
            
              <v-btn
                variant="text"
                @click="editItem(item)"
                color="yellow-darken-3"
                prepend-icon="mdi-pencil"
              >
                Editar
              </v-btn>
              <v-btn
                variant="text"
                @click="deleteItem(item)"
                color="red-darken-3"
                prepend-icon="mdi-delete"
              >
                Eliminar
              </v-btn>
          </template>
        </v-data-table>
      </v-card><br>
      <v-row>
        <v-col cols="12">
          <v-btn
            @click="addItem"
            color="green-darken-4" block
          >
            Agregar
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="editQuestion" max-width="500px">
    <v-card>
      <v-card-title>
        {{ item._id ? 'Editar Pregunta' : 'Agregar Pregunta' }}
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="item.question" label="Pregunta" outlined color="green darken-4"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="item.answer" label="Respuesta" outlined color="green darken-4"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="error" @click="editQuestion = false">Cancelar</v-btn>
        <v-btn color="green-darken-4" @click="item._id ? editQuestionItem() : addQuestion()">
          {{ item._id ? 'Confirmar' : 'Agregar' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  
    <v-dialog 
      v-model="deleteDialog" 
      width="auto"
      persistent
    >
      <v-card>
        <v-card-title>
          Eliminar una pregunta
        </v-card-title>
        <v-card-text>
          Estas seguro de eliminar la pregunta.<br>
          {{ ($t('admin.cotize.cotizeWindow.description1String')) }}
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="error" @click="deleteDialog = false">No</v-btn>
          <v-btn color="green-darken-4" @click="deleteQuestion"> {{ ($t('admin.cotize.cotizeWindow.yesString')) }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :model-value="overlay" class="align-center justify-center">
        <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
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
          title: 'Questions',
          disabled: true,
          href: '/admin/questions',
        },
        
      ],
        overlay :  false,
        deleteDialog : false,
        editQuestion : false,
        search: "",
        headers: [
          {
            align: "start",
            key: "_id",
            title: "Id",
          },
          { key: "question", title: "Preguntas" },
          { key: "answer", title: "Respuestas" },
          { title: i18n.global.t('admin.cotize.cotizeWindow.actionsString'), key: "actions", sortable: false, align : 'center' },
        ],
        questions: [],
        item : {}
      };
    },
    methods: {
        deleteItem (item) {
            this.deleteDialog = true
            this.item = item
        },
        editItem (item) {
            this.editQuestion = true
            this.item = item
        },
        addItem (){
            this.editQuestion = true
            this.item = {
                question : '',
                answer : ''
            }
        },
        async deleteQuestion () {
            this.deleteDialog = false
            this.overlay = true
            try{
                const { data } = await api({
                    method : 'DELETE',
                    url : `/answer/delete/${this.item._id}`,
                    headers : {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                        'rol'   : 'admin'
                    }
                })
                if(data.success){
                    toast.success('Se elimino correctamente la pregunta')
                }else{
                    toast.error('Hubo un problema al eliminar una pregunta')
                }
            }catch (error) {
                console.log(error)
            }finally{
                this.overlay = false
                this.getQuestions()
            }
        },
        async editQuestionItem () {
            this.editQuestion = false
            this.overlay = true
            try{
                const datos = {
                    question: this.item.question ,
                    answer : this.item.answer
                }
                const { data } = await api({
                    method : 'PUT',
                    url : `/answer/update/${this.item._id}`,
                    headers : {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                        'rol'   : 'admin'
                    },
                    data : datos
                })
                if(data.success){
                    toast.success('Se edito correctamente')
                }else{
                    toast.error('Hubo un problema al editar una pregunta')
                }
            }catch (error) {
                console.log(error)
            }finally{
                this.overlay = false
                this.getQuestions()
            }
        },
        async addQuestion () {
            this.editQuestion = false
            this.overlay = true
            try{
                const datos = {
                    pregunta: this.item.question ,
                    respuesta : this.item.answer
                }
                const { data } = await api({
                    method : 'POST',
                    url : `/answer/add`,
                    headers : {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                        'rol'   : 'admin'
                    },
                    data : datos
                })
                if(data.success){
                    toast.success('Se agrego correctamente')
                }else{
                    toast.error('Hubo un problema al agregar una pregunta')
                    console.log('prueba')
                }
            }catch (error) {
                console.log(error)
            }finally{
                this.overlay = false
                this.getQuestions()
            }
        },
      async getQuestions() {
        try {
          const {data} =  await api.get('/answer/get')
          this.questions = data.asnwers
          console.log(data)
        }catch (error) {
          console.log(error);
        }
      },
    },
    mounted() {
      this.getQuestions()
    }
  };
  </script>