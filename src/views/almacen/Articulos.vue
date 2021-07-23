<template>
  <v-data-table :headers="headers" :items="articulos" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-btn @click="crearPDF" class="mx-2">
          <v-icon>
            mdi-printer
          </v-icon>
        </v-btn>
        <v-toolbar-title>articulos</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo Artículo
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="10" sm="6" md="4">
                    <v-text-field v-model="editedItem.codigo" label="Codigo"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="10" md="10">
                    <v-autocomplete
                      ref="categorias"
                      v-model="editedItem.categoria"
                      :items="categorias"
                      item-text="nombre"
                      item-value="_id"
                      label="Categoria"
                      placeholder="Select..."
                      required
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
                  </v-col>
                  <v-col cols="6" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.stock"
                      label="Stock"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.precioVenta"
                      label="precio"
                      type="number"
                      prefix="$"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="editedItem.descripcion"
                      label="descripcion"
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
              >Desactivar Artículo?</v-card-title
            >
            <v-card-title v-if="editedItem.estado == 0" class="headline"
              >Activar Artículo?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small color="red" v-if="item.estado == 1" @click="deleteItem(item)">
        mdi-minus-circle
      </v-icon>
      <v-icon small color="brown" v-if="item.estado == 0" @click="deleteItem(item)">
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
      <v-btn color="primary" @click="listarArticulos">
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  data: () => ({
    articulos: [],
    categorias: [],
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Actions', value: 'actions', sortable: false },
      { text: 'Codigo', value: 'codigo' },
      { text: 'Categoria', value: 'categoria.nombre' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Stock', value: 'stock' },
      { text: 'Precioventa', value: 'precioVenta' },
      { text: 'Descripcion', value: 'descripcion' }
    ],
    editedIndex: -1,
    editedItem: {
      codigo: '',
      categoria: '',
      nombre: '',
      stock: '',
      precioVenta: '',
      descripcion: ''
    },
    defaultItem: {
      codigo: '',
      categoria: '',
      nombre: '',
      stock: '',
      precioVenta: '',
      descripcion: ''
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Artículo' : 'Editar Artículo'
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    }
  },

  created() {
    this.listarArticulos()
    this.listarCategorias()
  },

  methods: {
    listarArticulos() {
      const { token } = this.$store.state
      axios
        .get('/articulo', {
          headers: { token }
        })
        .then(response => {
          this.articulos = response.data.articulo
        })
        .catch(error => {
          console.log(error)
        })
    },
    listarCategorias() {
      const { token } = this.$store.state
      axios
        .get('/categoria', {
          headers: { token }
        })
        .then(response => {
          this.categorias = response.data.categoria
        })
        .catch(error => {
          console.log(error)
        })
    },
    save() {
      if (this.editedIndex > -1) {
        // Put
        const { token } = this.$store.state
        axios
          .put(`/articulo/${this.editedItem._id}`, this.editedItem, {
            headers: { token }
          })
          .then(response => {
            console.log(response.data)
            this.listarArticulos()
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        // Post
        const { token } = this.$store.state
        axios
          .post('/articulo', this.editedItem, {
            headers: { token }
          })
          .then(response => {
            console.log(response.data)
            this.listarArticulos()
          })
          .catch(error => {
            console.log(error)
          })
      }
      this.close()
    },
    editItem(item) {
      this.editedIndex = this.articulos.indexOf(item)
      this.editedItem = { ...item }
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.articulos.indexOf(item)
      this.editedItem = { ...item }
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      if (this.editedItem.estado == 0) {
        this.activateItem()
      } else this.deactivateItem()
      this.closeDelete()
    },

    activateItem() {
      const { token } = this.$store.state
      axios
        .put(`/articulo/activar/${this.editedItem._id}`, this.editedItem, {
          headers: { token }
        })
        .then(response => {
          console.log(response.data)
          this.listarArticulos()
        })
        .catch(error => {
          console.log(error)
        })
    },

    deactivateItem() {
      const { token } = this.$store.state
      axios
        .put(`/articulo/desactivar/${this.editedItem._id}`, this.editedItem, {
          headers: { token }
        })
        .then(response => {
          console.log(response.data)
          this.listarArticulos()
        })
        .catch(error => {
          console.log(error)
        })
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },
    crearPDF() {
      var columns = [
        { title: 'Codigo', dataKey: 'Codigo' },
        { title: 'Categoria', dataKey: 'Categoria' },
        { title: 'Nombre', dataKey: 'Nombre' },
        { title: 'Stock', dataKey: 'Stock' },
        { title: 'Precio Venta', dataKey: 'precioVenta' },
        { title: 'Descripcion', dataKey: 'Descripcion' },
      ]
      var rows = []
      this.articulos.map(function(articulo) {
        rows.push({
          Codigo: articulo.codigo,
          Categoria: articulo.categoria.nombre,
          Nombre: articulo.nombre,
          Stock: articulo.stock,
          precioVenta: articulo.precioVenta,
          Descripcion: articulo.descripcion,
        })
      })
      var doc = new jsPDF('p', 'pt')
      doc.autoTable(columns, rows, {
        margin: { top: 60 },
        addPageContent: function() {
          doc.text('Lista de Articulos', 40, 30)
        }
      })

      doc.save('Articulos.pdf')
    }
  }
}
</script>
