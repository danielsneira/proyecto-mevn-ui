<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item to="/" replace link>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-group
          v-if="this.$store.state.rol === 'ADMIN_ROL' || this.$store.state.rol == 'ALMACENISTA_ROL'"
          :value="false"
          no-action
          sub-group
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Almacen</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="([title, icon, href], i) in Almacen" :key="i" :href="href" link>
            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
            <router-link :to="href" replace v-text="title"></router-link>
          </v-list-item>
        </v-list-group>
        <v-list-group
          v-if="this.$store.state.rol === 'ADMIN_ROL' || this.$store.state.rol == 'ALMACENISTA_ROL'"
          :value="false"
          no-action
          sub-group
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Compras</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="([title, icon, href], i) in Compras" :key="i" :href="href" link>
            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
            <router-link :to="href" replace v-text="title"></router-link>
          </v-list-item>
        </v-list-group>
        <v-list-group
          v-if="this.$store.state.rol === 'ADMIN_ROL' || this.$store.state.rol === 'VENDEDOR_ROL'"
          :value="false"
          no-action
          sub-group
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Ventas</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="([title, icon, href], i) in Ventas" :key="i" :href="href" link>
            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
            <router-link :to="href" replace v-text="title"></router-link>
          </v-list-item>
        </v-list-group>
        <v-list-group
          v-if="this.$store.state.rol === 'ADMIN_ROL'"
          :value="false"
          no-action
          sub-group
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Accesos</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="([title, icon, href], i) in Accesos"
            :key="i"
            :href="href"
            replace
            link
          >
            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
            <router-link :to="href" replace v-text="title"></router-link>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <span>{{ this.$router.currentRoute.name }}</span>
      <v-spacer></v-spacer>
      <v-btn @click="logout" to="/login" replace text>
        <v-icon>mdi-logout</v-icon>
        <span class="mr-2">Logout</span>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer color="primary" absolute app dark>
      <v-row justify="center" no-gutters>DSN©2021</v-row>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
      Almacen: [
        ['Articulos', 'mdi-cart', '/articulos'],
        ['Categorias', 'mdi-sitemap', '/categorias'],
      ],
      Compras: [
        ['Ingresos', 'mdi-store-plus', '/ingresos'],
        ['Proveedores', 'mdi-account-tie', '/proveedores'],
      ],
      Ventas: [
        ['Ventas', 'mdi-store-plus', '/ventas'],
        ['Clientes', 'mdi-account-star', '/clientes'],
      ],
      Accesos: [['Usuarios', 'mdi-account-supervisor', '/usuarios']],
      Consultas: [
        ['Compras', 'mdi-cart', '/consulta-compras'],
        ['Ventas', 'mdi-cart', '/consulta-ventas'],
      ],
    };
  },
  created() {
    this.checkToken();
  },
  methods: {
    logout() {
      sessionStorage.clear();
    },
    checkToken() {
      if (!this.$store.state.token && this.$router.currentRoute.name !== 'Login') {
        this.$router.push('Login');
      }
    },
  },
};
</script>

<style scoped>
.container {
  height: 100%;
}

a {
  text-decoration: none;
}
</style>
