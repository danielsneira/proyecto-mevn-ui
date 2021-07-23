import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;
// axios.defaults.baseURL = 'https://semillero-mevn-adsi.herokuapp.com/api';
axios.defaults.baseURL = '/api';

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

Vue.use(VueAxios, axios);
