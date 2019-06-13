import Vue from "vue";
import Vuex from "vuex";
import user from "./module/user";
import app from "./module/app";
import createPersistedState from "vuex-persistedstate" //vuex持久化

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app
  },
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })]

});
