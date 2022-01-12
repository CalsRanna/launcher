<template>
  <div>
    <el-container>
      <div
        style="height: 16px;text-align: right;line-height: 16px;margin: 8px 0;"
      >
        <el-button type="text" size="mini" style="padding: 0" @click="minimize">
          <i class="el-icon-minus" style="font-size: 16px;"></i>
        </el-button>
        <el-button type="text" size="mini" style="padding: 0" @click="exit">
          <i class="el-icon-close" style="font-size: 16px;"></i>
        </el-button>
      </div>
      <el-header class="header">
        <el-button
          icon="el-icon-s-grid"
          :disabled="module === 'launcher'"
          @click="navigate('launcher')"
        >
          登录游戏
        </el-button>
        <el-button
          style="margin-left: 8px;"
          :disabled="module === 'configuration-editor'"
          @click="navigate('configuration-editor')"
        >
          配置编辑
        </el-button>
        <el-button
          style="margin-left: 8px;"
          :disabled="module === 'setting'"
          @click="navigate('setting')"
        >
          设置
        </el-button>
        <el-button style="margin-left: 8px;" @click="open('foxy')">
          Foxy
        </el-button>
        <el-button style="margin-left: 8px;" @click="open('mpq-editor')">
          MPQ Editor
        </el-button>
        <el-button style="margin-left: 8px;" @click="open('navicat')">
          Navicat
        </el-button>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
const ipcRenderer = window.ipcRenderer;
import { MessageBox } from "element-ui";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      module: "launcher",
    };
  },
  methods: {
    ...mapActions("launcher", [
      "updateProcess",
      "updateConsole",
      "clearConsole",
    ]),
    minimize() {
      ipcRenderer.send("MINIMIZE");
    },
    exit() {
      ipcRenderer.send("EXIT_APP");
    },
    open(software) {
      ipcRenderer.send("OPEN_SOFTWARE", { software });
    },
    navigate(module) {
      this.module = module;
      this.$router.push(`/${module}`).then(() => {});
    },
  },
  mounted() {
    ipcRenderer.on("CHILD_PROCESS_PIDS", (event, payload) => {
      this.updateProcess(payload);
    });
    ipcRenderer.on("CHILD_PROCESS_STDOUT", (event, payload) => {
      this.updateConsole(payload);
    });
    ipcRenderer.on("CHILD_PROCESS_CLEAR", (event, payload) => {
      this.clearConsole(payload);
    });
    ipcRenderer.on("GLOBAL_MESSAGE", (event, response) => {
      MessageBox.alert(response, "未知错误", {
        confirmButtonText: "确定",
      });
    });
    if (!localStorage.getItem("config_path")) {
      localStorage.setItem(
        "config_path",
        "D:/Simulators/Server/AzerothCore/Core/configs"
      );
    }
    if (!localStorage.getItem("mysql_path")) {
      localStorage.setItem(
        "mysql_path",
        "D:/Simulators/Server/AzerothCore/Database/bin/"
      );
    }
    if (!localStorage.getItem("world_server_path")) {
      localStorage.setItem(
        "world_server_path",
        "D:/Simulators/Server/AzerothCore/Core/"
      );
    }
    if (!localStorage.getItem("auth_server_path")) {
      localStorage.setItem(
        "auth_server_path",
        "D:/Simulators/Server/AzerothCore/Core/"
      );
    }
    if (!localStorage.getItem("client_path")) {
      localStorage.setItem(
        "client_path",
        "D:/Simulators/Client/Wrath of Lich King/"
      );
    }
    if (!localStorage.getItem("foxy_path")) {
      localStorage.setItem("foxy_path", "D:/Simulators/Tool/");
    }
    if (!localStorage.getItem("mpq_editor_path")) {
      localStorage.setItem("mpq_editor_path", "D:/Simulators/Tool/MPQEditor/");
    }
    if (!localStorage.getItem("navicat_path")) {
      localStorage.setItem(
        "navicat_path",
        "D:/Simulators/Tool/Navicat Premium/"
      );
    }
    ipcRenderer.send("INIT_PATHS", {
      mysql: localStorage.getItem("mysql_path"),
      worldServer: localStorage.getItem("world_server_path"),
      authServer: localStorage.getItem("auth_server_path"),
      client: localStorage.getItem("client_path"),
      foxy: localStorage.getItem("foxy_path"),
      mpqEditor: localStorage.getItem("mpq_editor_path"),
      navicat: localStorage.getItem("navicat_path"),
    });
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0 16px 16px 16px;
  font-family: "Roboto Mono", monospace;
}
.el-main {
  padding: 0 !important;
}

.el-main > .el-row {
  margin: 16px 0 0 0 !important;
}

.el-main > .el-row > .el-col {
  padding: 0 !important;
}
.header {
  background-color: rgba(40, 42, 50, 0.25);
  line-height: 60px;
  border-radius: 8px;
}
.el-card__header {
  padding: 0 20px !important;
}
.el-card__body {
  padding: 16px !important;
}
.el-dropdown > .el-button-group > .el-button:first-child {
  width: 131px;
}
</style>
