<template>
  <v-data-table :headers="headers" :items="usuarios" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Usuarios</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo Usuario
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="editedItem.nombre"
                      label="Nombre"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" sm="6" md="6">
                    <v-autocomplete
                      ref="rol"
                      v-model="editedItem.rol"
                      :items="roles"
                      label="Rol"
                      placeholder="Select rol"
                      required
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="6" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.email"
                      label="E-mail"
                      type="email"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" sm="6" md="6">
                    <v-text-field
                      v-model="password"
                      label="Password"
                      type="password"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title v-if="editedItem.estado == 1" class="headline"
              >Desactivar Usuario?</v-card-title
            >
            <v-card-title v-if="editedItem.estado == 0" class="headline"
              >Activar Usuario?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        color="red"
        v-if="item.estado == 1"
        @click="deleteItem(item)"
      >
        mdi-minus-circle
      </v-icon>
      <v-icon
        small
        color="brown"
        v-if="item.estado == 0"
        @click="deleteItem(item)"
      >
        mdi-minus-circle-off
      </v-icon>
    </template>
    <template v-slot:item.estado="{ item }">
      <span class="blue--text" v-if="item.estado == 1">
        Activo
      </span>
      <span class="red--text" v-else>
        Inactivo
      </span>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="listarUsuarios">
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    usuarios: [],
    roles: ['ADMIN_ROL', 'VENDEDOR_ROL', 'ALMACENISTA_ROL'],
    dialog: false,
    dialogDelete: false,
    password: '',
    headers: [
      { text: 'Actions', value: 'actions', sortable: false },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Rol', value: 'rol' },
      { text: 'E-mail', value: 'email' },
      { text: 'Estado', value: 'estado' },
    ],
    editedIndex: -1,
    editedItem: {
      nombre: '',
      email: '',
      rol: '',
      password: '',
    },
    defaultItem: {
      nombre: '',
      email: '',
      rol: '',
      password: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.listarUsuarios();
  },

  methods: {
    listarUsuarios() {
      const { token } = this.$store.state;
      axios
        .get('/usuario', {
          headers: { token },
        })
        .then((response) => {
          console.log(response.data);
          this.usuarios = response.data.usuario;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    save() {
      if (this.editedIndex > -1) {
        // Put
        if (this.password) {
          this.editedItem.password = this.password;
        }
        const { token } = this.$store.state;
        axios
          .put(`/usuario/${this.editedItem._id}`, this.editedItem, {
            headers: { token },
          })
          .then((response) => {
            console.log(response.data);
            this.listarUsuarios();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        // Post
        const { token } = this.$store.state;
        this.editedItem.password = this.password;
        axios
          .post('/usuario', this.editedItem, {
            headers: { token },
          })
          .then((response) => {
            console.log(response.data);
            this.listarUsuarios();
          })
          .catch((error) => {
            console.log(error);
          });
      }
      this.close();
    },
    editItem(item) {
      this.editedIndex = this.usuarios.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.usuarios.indexOf(item);
      this.editedItem = { ...item };
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      if (this.editedItem.estado == 0) {
        this.activateItem();
      } else this.deactivateItem();
      this.closeDelete();
    },

    activateItem() {
      const { token } = this.$store.state;
      axios
        .put(`/usuario/activar/${this.editedItem._id}`, this.editedItem, {
          headers: { token },
        })
        .then((response) => {
          console.log(response.data);
          this.listarUsuarios();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    deactivateItem() {
      const { token } = this.$store.state;
      axios
        .put(`/usuario/desactivar/${this.editedItem._id}`, this.editedItem, {
          headers: { token },
        })
        .then((response) => {
          console.log(response.data);
          this.listarUsuarios();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },
  },
};
</script>
