export default {
  namespaced: true,
  state() {
    return {
      mysqld: {
        processes: [],
        log: "",
      },
      authServer: {
        processes: [],
        log: "",
      },
      worldServer: {
        processes: [],
        log: "",
      },
    };
  },
  actions: {
    updateMysqld({ commit }, payload) {
      return new Promise((resolve) => {
        commit("UPDATE_MYSQLD", payload);
        resolve();
      });
    },
    updateAuthServer({ commit }, payload) {
      return new Promise((resolve) => {
        commit("UPDATE_AUTH_SERVER", payload);
        resolve();
      });
    },
    updateWorldServer({ commit }, payload) {
      return new Promise((resolve) => {
        commit("UPDATE_WORLD_SERVER", payload);
        resolve();
      });
    },
    checkProcesses({ commit }, payload) {
      return new Promise((resolve) => {
        commit("CHECK_PROCESSES", payload);
        resolve();
      });
    },
  },
  mutations: {
    UPDATE_MYSQLD(state, payload) {
      state.mysqld.log = `${state.mysqld.log}${payload}`;
    },
    UPDATE_AUTH_SERVER(state, payload) {
      state.authServer.log = `${state.authServer.log}${payload}`;
    },
    UPDATE_WORLD_SERVER(state, payload) {
      state.worldServer.log = `${state.worldServer.log}${payload}`;
    },
    CHECK_PROCESSES(state, payload) {
      state.mysqld.processes = payload.mysqld;
      state.authServer.processes = payload.authserver;
      state.worldServer.processes = payload.worldserver;
    },
  },
};
