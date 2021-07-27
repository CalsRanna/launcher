import Vue from "vue";
import Vuex from "vuex";
import launcher from "./launcher";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    launcher,
  },
});
