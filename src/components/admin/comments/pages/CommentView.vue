<!-- <template>
<v-container>
    <v-card title="Comentarios" flat>
        <template v-slot:text>
            <v-text-field v-model="search" label="Comentarios" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line></v-text-field>
        </template>

        <v-data-table :headers="headers" :items="comments" :search="search">
            <template v-slot:item.user="{ item }">
                {{ item.user.name }} {{ item.user.apellidoP }} {{ item.user.apellidoM }}
            </template>
            <template v-slot:item.service="{ item }">
                {{ item.service.name }}
            </template>
            <template v-slot:item.rating="{ item }">
                <v-rating v-model="item.rating" color="yellow" readonly size="18"></v-rating>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-btn variant="text" @click="openEditDialog(item)" color="yellow-darken-3" prepend-icon="mdi-pencil">
                    Actualizar
                </v-btn>
                <v-btn :loading="item.loading" :disabled="item.loading" variant="text" @click="deleteComment(item)" color="red-darken-3" prepend-icon="mdi-delete">
                    Eliminar
                </v-btn>
            </template>
        </v-data-table>
    </v-card>
</v-container>

<v-dialog v-model="commentDialog" width="600">
    <v-card>
        <v-card-title>Editar Comentario</v-card-title>
        <v-card-text>
            <v-form ref="commentForm">
                <v-text-field v-model="form.comment" label="Comentario" required></v-text-field>
                <v-rating v-model="form.rating" label="Rating" color="yellow" half-increments required></v-rating>
            </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
            <v-btn text @click="commentDialog = false">Cancelar</v-btn>
            <v-btn color="primary" @click="updateComment">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
    import {
        api
    } from "@/axios/axios.js";
    import {
        toast
    } from "vue3-toastify";
    import {
        i18n
    } from "@/main.js";

    export default {
        data() {
            return {
                search: "",
                headers: [{
                        key: "user",
                        title: "Usuario"
                    },
                    {
                        key: "service",
                        title: "Servicio"
                    },
                    {
                        key: "comment",
                        title: "Comentario"
                    },
                    {
                        key: "rating",
                        title: "Rating"
                    },
                    {
                        title: i18n.global.t("admin.cotize.cotizeWindow.actionsString"),
                        key: "actions",
                        sortable: false,
                        align: "center",
                    },
                ],
                comments: [],
                form: {
                    comment: "",
                    rating: null,
                },
                commentDialog: false,
                currentCommentId: null,
            };
        },
        methods: {
            async getComments() {
                try {
                    const {
                        data
                    } = await api.get("/comment/get");
                    this.comments = data.comments.map(comment => ({
                        ...comment,
                        loading: false,
                    }));
                } catch (error) {
                    console.log(error);
                }
            },
            openEditDialog(comment) {
                this.currentCommentId = comment._id;
                this.form = {
                    comment: comment.comment,
                    rating: comment.rating,
                };
                this.commentDialog = true;
            },
            async updateComment() {
                const token = localStorage.getItem("token");
                try {
                    const {
                        data
                    } = await api({
                        method: 'PUT',
                        url: `/comment/update/${this.currentCommentId}`,
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'rol': 'admin',
                        },
                        data: this.form
                    })
                    if (data.success) {
                        toast.success("Comentario actualizado correctamente");
                        this.getComments();
                        this.commentDialog = false;
                    } else {
                        toast.warning(data.msg);
                    }
                } catch (error) {
                    toast.error("Error al actualizar el comentario");
                }
            },
            async deleteComment(comment) {
                comment.loading = true;
                const token = localStorage.getItem("token");
                try {
                    const {
                        data
                    } = await api.delete(`/comment/delete/${comment._id}`, {
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'rol': 'admin',
                        },
                    });
                    if (data.success) {
                        toast.success("Comentario eliminado correctamente");
                        this.getComments();
                        this.commentDialog = false;
                    } else {
                        toast.warning(data.msg);
                    }
                    this.getComments();
                } catch (error) {
                    toast.error("Error al eliminar el comentario");
                } finally {
                    comment.loading = false;
                }
            },
        },
        mounted() {
            this.getComments();
        },
    };
</script> -->

<template>
    <v-container>
        <!-- Botón para redirigir a la vista de análisis -->
        <v-row class="mb-3">
            <v-col cols="12" class="text-right">
                <v-btn variant="outliined" color="green-darken-3" @click="redirectToAnalysis">Ir a Análisis</v-btn>
            </v-col>
        </v-row>

        <v-card title="Comentarios" flat>
            <template v-slot:text>
                <v-text-field v-model="search" label="Comentarios" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line></v-text-field>
            </template>

            <v-data-table :headers="headers" :items="comments" :search="search">
                <template v-slot:item.user="{ item }">
                    {{ item.user.name }} {{ item.user.apellidoP }} {{ item.user.apellidoM }}
                </template>
                <template v-slot:item.service="{ item }">
                    {{ item.service.name }}
                </template>
                <template v-slot:item.rating="{ item }">
                    <v-rating v-model="item.rating" color="yellow" readonly size="18"></v-rating>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-btn variant="text" @click="openEditDialog(item)" color="yellow-darken-3" prepend-icon="mdi-pencil">
                        Actualizar
                    </v-btn>
                    <v-btn :loading="item.loading" :disabled="item.loading" variant="text" @click="deleteComment(item)" color="red-darken-3" prepend-icon="mdi-delete">
                        Eliminar
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>
    </v-container>

    <v-dialog v-model="commentDialog" width="600">
        <v-card>
            <v-card-title>Editar Comentario</v-card-title>
            <v-card-text>
                <v-form ref="commentForm">
                    <v-text-field v-model="form.comment" label="Comentario" required></v-text-field>
                    <v-rating v-model="form.rating" label="Rating" color="yellow" half-increments required></v-rating>
                </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn text @click="commentDialog = false">Cancelar</v-btn>
                <v-btn color="primary" @click="updateComment">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { api } from "@/axios/axios.js";
import { toast } from "vue3-toastify";
import { i18n } from "@/main.js";

export default {
  data() {
    return {
      search: "",
      headers: [
        { key: "user", title: "Usuario" },
        { key: "service", title: "Servicio" },
        { key: "comment", title: "Comentario" },
        { key: "rating", title: "Rating" },
        {
          title: i18n.global.t("admin.cotize.cotizeWindow.actionsString"),
          key: "actions",
          sortable: false,
          align: "center",
        },
      ],
      comments: [],
      form: {
        comment: "",
        rating: null,
      },
      commentDialog: false,
      currentCommentId: null,
    };
  },
  methods: {
    async getComments() {
      try {
        const { data } = await api.get("/comment/get");
        this.comments = data.comments.map(comment => ({
          ...comment,
          loading: false,
        }));
      } catch (error) {
        console.log(error);
      }
    },
    openEditDialog(comment) {
      this.currentCommentId = comment._id;
      this.form = {
        comment: comment.comment,
        rating: comment.rating,
      };
      this.commentDialog = true;
    },
    async updateComment() {
      const token = localStorage.getItem("token");
      try {
        const { data } = await api({
          method: 'PUT',
          url: `/comment/update/${this.currentCommentId}`,
          headers: {
            'Authorization': 'Bearer ' + token,
            'rol': 'admin',
          },
          data: this.form
        })
        if (data.success) {
          toast.success("Comentario actualizado correctamente");
          this.getComments();
          this.commentDialog = false;
        } else {
          toast.warning(data.msg);
        }
      } catch (error) {
        toast.error("Error al actualizar el comentario");
      }
    },
    async deleteComment(comment) {
      comment.loading = true;
      const token = localStorage.getItem("token");
      try {
        const { data } = await api.delete(`/comment/delete/${comment._id}`, {
          headers: {
            'Authorization': 'Bearer ' + token,
            'rol': 'admin',
          },
        });
        if (data.success) {
          toast.success("Comentario eliminado correctamente");
          this.getComments();
          this.commentDialog = false;
        } else {
          toast.warning(data.msg);
        }
        this.getComments();
      } catch (error) {
        toast.error("Error al eliminar el comentario");
      } finally {
        comment.loading = false;
      }
    },
    redirectToAnalysis() {
      this.$router.push({ name: 'analisys' });
    },
  },
  mounted() {
    this.getComments();
  },
};
</script>
