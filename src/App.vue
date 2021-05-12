<template>
  <div id="app">
    <el-container>
      <el-header class="header">
        <el-button icon="el-icon-s-grid">所有选项</el-button>
        <el-dropdown
          split-button
          type="primary"
          style="margin-left: 8px;"
          @click="handleClick"
        >
          配置编辑
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          icon="el-icon-setting"
          style="margin-left: 8px;"
          @click="startClient"
        >
          设置
        </el-button>
      </el-header>
      <el-main>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-card style="height: 789px;">
              <h3 style="margin: 0px;text-align: center;">魔兽世界</h3>
              <div style="position: absolute; bottom: 16px;">
                <div style="position: relative;">
                  <div style="height: 12px;line-height: 12px;font-size: 12px;">
                    游戏版本
                  </div>
                  <el-select
                    v-model="version"
                    style="margin-top: 8px;width: 260px;"
                  >
                    <el-option
                      label="AzerothCore"
                      value="AzerothCore"
                    ></el-option>
                  </el-select>
                  <div style="margin-top: 8px;">
                    <el-button
                      type="primary"
                      style="border-radius: 4px 0 0 4px;width:228px;"
                      @click="enterGame"
                    >
                      进入游戏
                    </el-button>

                    <el-dropdown
                      type="primary"
                      placement="top-start"
                      trigger="click"
                      @command="handleCommand"
                    >
                      <el-button
                        type="primary"
                        icon="el-icon-setting"
                        style="margin-left: 0px;padding: 12px 8px;border-radius: 0 4px 4px 0;border-left-color: #ffffff;"
                      ></el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="mysql">
                          启动Mysql
                        </el-dropdown-item>
                        <el-dropdown-item command="auth">
                          启动Auth Server
                        </el-dropdown-item>
                        <el-dropdown-item command="world">
                          启动World Server
                        </el-dropdown-item>
                        <el-dropdown-item command="stop" divided>
                          停止服务
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="18" style="font-size: 10px;">
            <el-card
              ref="mysqlCard"
              style="height: 251px; margin: 0 0 0 16px;overflow: auto;"
            >
              <div v-html="mysql.replaceAll('\n', '<br>')"></div>
            </el-card>
            <el-card
              ref="authCard"
              style="height: 251px; margin: 16px 0 0 16px;overflow: auto;"
            >
              <div v-html="auth.replaceAll('\n', '<br>')"></div>
            </el-card>
            <el-card
              ref="worldCard"
              style="height: 251px; margin: 16px 0 0 16px;overflow: auto;"
            >
              <div v-html="world.replaceAll('\n', '<br>')"></div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
const ipcRenderer = window.ipcRenderer;

export default {
  data() {
    return {
      version: "AzerothCore",
      mysql: "",
      auth: "",
      world: "",
    };
  },
  methods: {
    enterGame() {
      this.msyql = "";
      this.auth = "";
      this.world = "";
      ipcRenderer.send("START_MYSQL");
      setTimeout(() => {
        ipcRenderer.send("START_AUTH_SERVER");
        ipcRenderer.send("START_WORLD_SERVER");
      }, 1500);
    },
    startClient() {
      ipcRenderer.send("START_CLIENT");
    },
    handleCommand(command) {
      switch (command) {
        case "mysql":
          this.msyql = "";
          ipcRenderer.send("START_MYSQL");
          break;
        case "auth":
          this.auth = "";
          ipcRenderer.send("START_AUTH_SERVER");
          break;
        case "world":
          this.world = "";
          ipcRenderer.send("START_WORLD_SERVER");
          break;
        case "stop":
          ipcRenderer.send("STOP_SERVICES");
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    ipcRenderer.on("START_MYSQL", (event, response) => {
      this.mysql = `${this.mysql}${response}`;
      let element = this.$refs["mysqlCard"].$el;
      this.$nextTick(() => {
        element.scrollTop = element.scrollHeight;
      });
    });
    ipcRenderer.on("START_AUTH_SERVER", (event, response) => {
      this.auth = `${this.auth}${response}`;
      let element = this.$refs["authCard"].$el;
      this.$nextTick(() => {
        element.scrollTop = element.scrollHeight;
      });
    });
    ipcRenderer.on("START_WORLD_SERVER", (event, response) => {
      this.world = `${this.world}${response}`;
      let element = this.$refs["worldCard"].$el;
      this.$nextTick(() => {
        element.scrollTop = element.scrollHeight;
      });
    });
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 8px;
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
  background-color: rgba(40, 42, 50, 0.5);
  line-height: 60px;
  border-radius: 8px;
}
.el-card__body {
  padding: 16px !important;
}
.el-dropdown > .el-button-group > .el-button:first-child {
  width: 131px;
}
</style>
