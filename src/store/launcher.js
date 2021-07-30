export default {
  namespaced: true,
  state() {
    return {
      process: {
        mysql: [],
        authServer: [],
        worldServer: [],
      },
      console: {
        mysql: "",
        authServer: "",
        worldServer: "",
      },
    };
  },
  actions: {
    updateProcess({ commit }, payload) {
      commit("UPDATE_PROCESS", payload);
    },
    updateConsole({ commit }, payload) {
      commit("UPDATE_CONSOLE", payload);
    },
  },
  mutations: {
    UPDATE_PROCESS(state, payload) {
      state.process[payload.channel] = payload.process;
    },
    UPDATE_CONSOLE(state, payload) {
      state.console[payload.channel] += payload.message;
    },
  },
};
