<template>
  <div style="height: 789px; margin: 0 0 0 16px;overflow: auto;">
    <el-button type="primary" plain @click="dialogVisible = true"
      >添加</el-button
    >
    <el-dialog title="游戏版本" :visible.sync="dialogVisible">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本">
          <el-select
            v-model="form.version"
            style="width: 100%"
            placeholder="请选择游戏版本"
          >
            <el-option label="3.3.5 12340" :value="12340"></el-option>
            <el-option label="7.3.5 26972" :value="26972"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确定</el-button
        >
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-card style="margin-top: 16px;">
      <h3 slot="header">
        Azeroth Core
        <small style="color: #909399">3.3.5 12340</small>
      </h3>
      <el-form :model="path" label-width="120px">
        <el-form-item label="Mysqld">
          <el-input v-model="path.mysql">
            <el-button slot="append" @click="() => chooseFile('mysql')"
              >选择文件</el-button
            >
          </el-input>
        </el-form-item>
        <el-form-item label="World Server">
          <el-input v-model="path.worldServer">
            <el-button slot="append" @click="() => chooseFile('worldServer')"
              >选择文件</el-button
            ></el-input
          >
        </el-form-item>
        <el-form-item label="Auth Server">
          <el-input v-model="path.authServer">
            <el-button slot="append" @click="() => chooseFile('authServer')"
              >选择文件</el-button
            ></el-input
          >
        </el-form-item>
        <el-form-item label="Config">
          <el-input v-model="path.config">
            <el-button slot="append" @click="() => chooseDirectory('config')"
              >选择文件夹</el-button
            ></el-input
          >
        </el-form-item>
        <el-form-item label="Client">
          <el-input v-model="path.client">
            <el-button slot="append" @click="() => chooseFile('client')"
              >选择文件</el-button
            ></el-input
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="store">保存</el-button>
          <el-button type="danger">删除</el-button>
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
      dialogVisible: false,
      form: {
        name: "",
        version: 12340,
      },
      path: {
        mysql: "",
        worldServer: "",
        authServer: "",
        client: "",
        config: "",
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
            case "mysql":
              this.path.mysql = filePath;
              break;
            case "worldServer":
              this.path.worldServer = filePath;
              break;
            case "authServer":
              this.path.authServer = filePath;
              break;
            case "client":
              this.path.client = filePath;
              break;
            default:
              break;
          }
        }
      });
    },
    chooseDirectory(component) {
      ipcRenderer.send("CHOOSE_DIRECTORY");
      ipcRenderer.once("CHOOSE_DIRECTORY", (event, payload) => {
        let filePath =
          payload.filePaths.length > 0 ? payload.filePaths[0] : null;
        if (filePath != null) {
          switch (component) {
            case "config":
              this.path.config = filePath;
              break;
            default:
              break;
          }
        }
      });
    },
    store() {
      localStorage.setItem("mysql_path", this.path.mysql);
      localStorage.setItem("world_server_path", this.path.worldServer);
      localStorage.setItem("auth_server_path", this.path.authServer);
      localStorage.setItem("client_path", this.path.client);
      localStorage.setItem("config_path", this.path.config);
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
      mysql: localStorage.getItem("mysql_path"),
      worldServer: localStorage.getItem("world_server_path"),
      authServer: localStorage.getItem("auth_server_path"),
      config: localStorage.getItem("config_path"),
      client: localStorage.getItem("client_path"),
    };
  },
};
</script>
