<template>
  <v-data-table :headers="headers" :items="compras" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Ingresos</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="4" sm="4" md="4">
                    <v-autocomplete
                      ref="rol"
                      v-model="editedItem.tipoComprobante"
                      :items="tipoComprobante"
                      label="Tipo Comprobante"
                      :disabled="isDisabled"
                      placeholder="Tipo Comprobante"
                      required
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="4" sm="4" md="4">
                    <v-text-field
                      v-model="editedItem.serieComprobante"
                      label="Serie Comprobante"
                      :disabled="isDisabled"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4" sm="4" md="4">
                    <v-text-field
                      v-model="editedItem.numComprobante"
                      label="Número Comprobante"
                      :disabled="isDisabled"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="8" sm="8" md="8">
                    <v-autocomplete
                      ref="rol"
                      v-model="editedItem.persona"
                      :items="proveedores"
                      item-text="nombre"
                      item-value="_id"
                      label="proveedores"
                      :disabled="isDisabled"
                      placeholder="proveedores"
                      required
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="3" sm="3" md="3">
                    <v-text-field
                      v-model.number="editedItem.impuesto"
                      label="Impuesto"
                      :disabled="isDisabled"
                      type="number"
                      step="0.1"
                      suffix="%"
                      min="0"
                      max="100"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col v-if="editedIndex < 0" cols="6" sm="6" md="6">
                    <v-btn color="primary" dark class="mb-2" @click="agregar">
                      agregar articulo
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-data-table
                      :headers="detallesHeaders"
                      :items="editedItem.detalles"
                      class="elevation-1"
                    >
                      <template v-slot:top>
                        <v-toolbar flat>
                          <v-toolbar-title>Articulos</v-toolbar-title>
                          <v-divider class="mx-4" inset vertical></v-divider>
                        </v-toolbar>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
                <p>Total parcial: ${{ totalParcial }}</p>
                <p>Total impuesto: ${{ totalImpuesto }}</p>
                <p>Total neto: ${{ totalNeto }}</p>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancel
              </v-btn>
              <v-btn v-if="editedIndex < 0" color="blue darken-1" text @click="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title v-if="editedItem.estado == 1" class="headline"
              >Desactivar compra?</v-card-title
            >
            <v-card-title v-if="editedItem.estado == 0" class="headline"
              >Activar compra?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogArticulo" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Agregar Articulo</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="8" sm="8" md="8">
                    <v-autocomplete
                      ref="articulos"
                      v-model="articuloDetalle._id"
                      :items="articulos"
                      item-text="nombre"
                      item-value="_id"
                      @change="setArticleDetails"
                      label="Articulos"
                      placeholder="Articulos"
                      required
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="4" sm="4" md="4">
                    <v-text-field
                      v-model.number="articuloDetalle.cantidad"
                      label="Cantidad"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4" sm="4" md="4">
                    <v-text-field
                      v-model="articuloDetalle.precio"
                      label="Precio"
                      type="number"
                      suffix="$"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4" sm="4" md="4">
                    <v-text-field
                      v-model.number="articuloDetalle.descuento"
                      label="Descuento"
                      type="number"
                      step="0.1"
                      suffix="%"
                      min="0"
                      max="100"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="dialogArticulo = false">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="addArticle">
                Agregar
              </v-btn>
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
      <v-btn color="primary" @click="listarCompras">
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    compras: [],
    articuloDetalle: {},
    articulos: [],
    proveedores: [],
    totalParcial: 0,
    isDisabled: false,
    tipoComprobante: ['NOTA DEBITO', 'FACTURA', 'NOTA CREDITO'],
    dialog: false,
    dialogArticulo: false,
    dialogDelete: false,
    headers: [
      { text: 'Actions', value: 'actions', sortable: false },
      { text: 'Usuario', value: 'usuario.nombre' },
      { text: 'Proveedor', value: 'persona.nombre' },
      { text: 'Tipo Comprobante', value: 'tipoComprobante' },
      { text: 'Serie Comprobante', value: 'serieComprobante' },
      { text: 'Numero Comprobante', value: 'numComprobante' },
      { text: 'Fecha', value: 'createdAt' },
      { text: 'Impuesto (%)', value: 'impuesto' },
      { text: 'Total', value: 'total' },
      { text: 'Estado', value: 'estado' }
    ],
    detallesHeaders: [
      { text: 'articulo', value: 'articulo' },
      { text: 'cantidad', value: 'cantidad' },
      { text: 'precio', value: 'precio' },
      { text: 'descuento (%)', value: 'descuento' }
    ],
    editedIndex: -1,
    editedItem: {
      tipoComprobante: '',
      serieComprobante: '',
      numComprobante: '',
      persona: '',
      impuesto: '',
      detalles: [],
      total: ''
    },
    defaultItem: {
      tipoComprobante: '',
      serieComprobante: '',
      numComprobante: '',
      persona: '',
      impuesto: '',
      detalles: [
        {
          _id: '',
          articulo: '',
          cantidad: '',
          precio: '',
          descuento: ''
        }
      ],
      total: ''
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo' : 'Detalles'
    },
    totalImpuesto() {
      return this.totalParcial * (this.editedItem.impuesto / 100)
    },
    totalNeto() {
      return this.totalParcial + this.totalImpuesto
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
    this.listarCompras()
    this.listarArticulos()
    this.listarProveedores()
  },

  methods: {
    setArticleDetails() {
      this.articulos.forEach(articulo => {
        if (articulo._id === this.articuloDetalle._id) {
          this.articuloDetalle.articulo = articulo.nombre
          this.articuloDetalle.precio = articulo.precioVenta
        }
      })
    },
    listarCompras() {
      const { token } = this.$store.state
      axios
        .get('/compra', {
          headers: { token }
        })
        .then(response => {
          console.log(response.data)
          this.compras = response.data.compra
        })
        .catch(error => {
          console.log(error)
        })
    },
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
    listarProveedores() {
      const { token } = this.$store.state
      axios
        .get('/persona/listProveedores', {
          headers: { token }
        })
        .then(response => {
          this.proveedores = response.data.persona
        })
        .catch(error => {
          console.log(error)
        })
    },
    save() {
      if (this.editedIndex > -1) {
        // Put no aplica
      } else {
        // Post
        this.editedItem.total = this.totalNeto
        this.editedItem.usuario = this.$store.state.usuario._id
        const { token } = this.$store.state
        axios
          .post('/compra', this.editedItem, {
            headers: { token }
          })
          .then(response => {
            console.log(response.data)
            this.listarCompras()
          })
          .catch(error => {
            console.log(error)
          })
      }
      this.close()
    },
    editItem(item) {
      this.isDisabled = true
      this.editedIndex = this.compras.indexOf(item)
      this.editedItem = { ...item }
      this.dialog = true
      this.totalParcial = this.editedItem.detalles.reduce((suma, producto) => {
        return (
          suma +
          (producto.precio * producto.cantidad - producto.precio * (producto.descuento / 100))
        )
      }, 0)
    },

    deleteItem(item) {
      this.editedIndex = this.compras.indexOf(item)
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
        .put(`/compra/activar/${this.editedItem._id}`, this.editedItem, {
          headers: { token }
        })
        .then(response => {
          console.log(response.data)
          this.listarCompras()
        })
        .catch(error => {
          console.log(error)
        })
    },

    deactivateItem() {
      const { token } = this.$store.state
      axios
        .put(`/compra/desactivar/${this.editedItem._id}`, this.editedItem, {
          headers: { token }
        })
        .then(response => {
          console.log(response.data)
          this.listarCompras()
        })
        .catch(error => {
          console.log(error)
        })
    },

    agregar() {
      this.dialogArticulo = true
    },

    addArticle() {
      this.editedItem.detalles.push(this.articuloDetalle)
      this.articuloDetalle = {}
      this.dialogArticulo = false
      this.totalParcial = this.editedItem.detalles.reduce((suma, producto) => {
        return (
          suma +
          (producto.precio * producto.cantidad - producto.precio * (producto.descuento / 100))
        )
      }, 0)
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
      this.isDisabled = false
      this.totalParcial = 0
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    }
  }
}
</script>
<style scoped>
p {
  margin-bottom: 0;
  margin-top: 0.5em;
  font-size: 1.2em;
}
</style>
