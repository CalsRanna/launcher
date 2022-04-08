<template>
  <div style="height: 789px; margin: 0 0 0 16px;overflow: auto;">
    <el-card>
      <el-form :model="path" label-width="120px">
        <el-form-item label="Foxy">
          <el-input v-model="path.foxy"
            ><el-button slot="append" @click="() => chooseFile('foxy')"
              >选择文件</el-button
            ></el-input
          >
        </el-form-item>
        <el-form-item label="MPQ Editor">
          <el-input v-model="path.mpqEditor"
            ><el-button slot="append" @click="() => chooseFile('mpqEditor')"
              >选择文件</el-button
            ></el-input
          >
        </el-form-item>
        <el-form-item label="Navicat">
          <el-input v-model="path.navicat"
            ><el-button slot="append" @click="() => chooseFile('navicat')"
              >选择文件</el-button
            ></el-input
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="store">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
const ipcRenderer = window.ipcRenderer;
import { Notification } from "element-ui";

export default {
  data() {
    return {
      path: {
        foxy: "",
        mpqEditor: "",
        navicat: "",
      },
    };
  },
  methods: {
    chooseFile(component) {
      ipcRenderer.send("CHOOSE_FILE");
      ipcRenderer.once("CHOOSE_FILE", (event, payload) => {
        let filePath =
          payload.filePaths.length > 0 ? payload.filePaths[0] : null;
        if (filePath != null) {
          switch (component) {
            case "foxy":
              this.path.foxy = filePath;
              break;
            case "mpqEditor":
              this.path.mpqEditor = filePath;
              break;
            case "navicat":
              this.path.navicat = filePath;
              break;
            default:
              break;
          }
        }
      });
    },
    store() {
      localStorage.setItem("foxy_path", this.path.foxy);
      localStorage.setItem("mpq_editor_path", this.path.mpqEditor);
      localStorage.setItem("navicat_path", this.path.navicat);
      Notification({
        title: "保存成功",
        type: "success",
      });
      ipcRenderer.send("INIT_PATHS", {
        mysql: localStorage.getItem("mysql_path"),
        worldServer: localStorage.getItem("world_server_path"),
        authServer: localStorage.getItem("auth_server_path"),
        config: localStorage.getItem("config_path"),
        client: localStorage.getItem("client_path"),
        foxy: localStorage.getItem("foxy_path"),
        mpqEditor: localStorage.getItem("mpq_editor_path"),
        navicat: localStorage.getItem("navicat_path"),
      });
    },
    navigate(index) {
      this.$router.push(`/setting/${index}`).then(() => {});
    },
  },
  mounted() {
    this.path = {
      foxy: localStorage.getItem("foxy_path"),
      mpqEditor: localStorage.getItem("mpq_editor_path"),
      navicat: localStorage.getItem("navicat_path"),
    };
  },
};
</script>
