import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
// import dependency to handle HTTP request to our back end
Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],

  // to handle state
  state: {
    token: '',
    rol: '',
    usuario: {}
  },
  // to handle mutations
  mutations: {
    setToken(state, value) {
      state.token = value;
    },
    setUsuario(state, value) {
      state.rol = value.rol;
      state.usuario = value;
    },
  },
  // to handle actions
  actions: {
    setToken(context, value) {
      context.commit('setToken', value);
    },
    setUsuario(context, value) {
      context.commit('setUsuario', value);
    },
  },
  // to handle state
  getters: {},

  modules: {},
});
