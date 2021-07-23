import Vue from 'vue';
import VueRouter from 'vue-router';
import login from '../views/login.vue';
import Home from '../views/Home.vue';
import Articulos from '../views/almacen/Articulos.vue';
import Categorias from '../views/almacen/Categorias.vue';
import Ingresos from '../views/compras/Ingresos.vue';
import Proveedores from '../views/compras/Proveedores.vue';
import Ventas from '../views/ventas/Ventas.vue';
import Clientes from '../views/ventas/Clientes.vue';
import Usuarios from '../views/accesos/Usuarios.vue';

Vue.use(VueRouter);

export const routes = [
  {
    path: '/login',
    name: 'Login',
    component: login,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/articulos',
    name: 'Articulos',
    component: Articulos,
  },
  {
    path: '/categorias',
    name: 'Categorias',
    component: Categorias,
  },
  {
    path: '/ingresos',
    name: 'Ingresos',
    component: Ingresos,
  },
  {
    path: '/proveedores',
    name: 'Proveedores',
    component: Proveedores,
  },
  {
    path: '/ventas',
    name: 'Ventas',
    component: Ventas,
  },
  {
    path: '/clientes',
    name: 'Clientes',
    component: Clientes,
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: Usuarios,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
