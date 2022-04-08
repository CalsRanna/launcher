export default {
  namespaced: true,
  state() {
    return {
      status: {
        mysql: false,
        authServer: false,
        worldServer: false,
      },
      disabled: {
        mysql: false,
        authServer: false,
        worldServer: false,
      },
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
    updateStatus({ commit }, payload) {
      commit("UPDATE_STATUS", payload);
    },
    updateProcess({ commit }, payload) {
      commit("UPDATE_PROCESS", payload);
    },
    updateConsole({ commit }, payload) {
      commit("UPDATE_CONSOLE", payload);
    },
    clearConsole({ commit }, payload) {
      commit("CLEAR_CONSOLE", payload);
    },
  },
  mutations: {
    UPDATE_STATUS(state, payload) {
      state.status[payload.service] = payload.status;
      state.disabled[payload.service] = true;
    },
    UPDATE_PROCESS(state, payload) {
      state.process[payload.channel] = payload.process;
      state.disabled[payload.channel] = false;
    },
    UPDATE_CONSOLE(state, payload) {
      state.console[payload.channel] += payload.message;
    },
    CLEAR_CONSOLE(state, payload) {
      state.console[payload.channel] = "";
    },
  },
};
