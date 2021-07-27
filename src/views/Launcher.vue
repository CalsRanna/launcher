<template>
  <el-row :gutter="16">
    <el-col :span="6">
      <el-card style="height: 789px;">
        <h3 style="margin: 0px;text-align: center;">魔兽世界</h3>
        <div style="line-height: 12px;font-size: 12px;">
          <p>
            Mysql:
            {{
              mysqld.processes.length === 0
                ? "未启动"
                : mysqld.processes.toString()
            }}
          </p>
          <p>
            Auth Server:
            {{
              authServer.processes.length === 0
                ? "未启动"
                : authServer.processes.toString()
            }}
          </p>
          <p>
            World Server:
            {{
              worldServer.processes.length === 0
                ? "未启动"
                : worldServer.processes.toString()
            }}
          </p>
        </div>
        <div style="position: absolute; bottom: 16px;">
          <div style="position: relative;">
            <div style="height: 12px;line-height: 12px;font-size: 12px;">
              游戏版本
            </div>
            <el-select v-model="version" style="margin-top: 8px;width: 260px;">
              <el-option label="AzerothCore" value="AzerothCore"></el-option>
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
                  <el-dropdown-item>
                    <el-dropdown placement="right" @command="handleCommand">
                      <span class="el-dropdown-link">
                        启动服务
                        <i class="el-icon-arrow-right"></i>
                      </span>
                      <el-dropdown-menu
                        slot="dropdown"
                        style="margin-left: 32px;"
                      >
                        <el-dropdown-item command="start-mysqld">
                          启动Mysql
                        </el-dropdown-item>
                        <el-dropdown-item command="start-auth-server">
                          启动Auth Server
                        </el-dropdown-item>
                        <el-dropdown-item command="start-world-server">
                          启动World Server
                        </el-dropdown-item>
                        <el-dropdown-item command="start-all" divided>
                          启动所有服务
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-dropdown placement="right" @command="handleCommand">
                      <span class="el-dropdown-link">
                        停止服务
                        <i class="el-icon-arrow-right"></i>
                      </span>
                      <el-dropdown-menu
                        slot="dropdown"
                        style="margin-left: 32px;"
                      >
                        <el-dropdown-item command="stop-mysqld">
                          停止Mysql
                        </el-dropdown-item>
                        <el-dropdown-item command="stop-auth-server">
                          停止Auth Server
                        </el-dropdown-item>
                        <el-dropdown-item command="stop-world-server">
                          停止World Server
                        </el-dropdown-item>
                        <el-dropdown-item command="stop-all" divided>
                          停止所有服务
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-dropdown-item>
                  <el-dropdown-item command="start-client" divided>
                    启动客户端
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
        ref="mysqldCard"
        style="height: 251px; margin: 0 0 0 16px;overflow: auto;"
      >
        <div v-html="mysqld.log.replaceAll('\n', '<br>')"></div>
      </el-card>
      <el-card
        ref="authServerCard"
        style="height: 251px; margin: 16px 0 0 16px;overflow: auto;"
      >
        <div v-html="authServer.log.replaceAll('\n', '<br>')"></div>
      </el-card>
      <el-card
        ref="worldServerCard"
        style="height: 251px; margin: 16px 0 0 16px;overflow: auto;"
      >
        <div v-html="worldServer.log.replaceAll('\n', '<br>')"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
const ipcRenderer = window.ipcRenderer;
import { MessageBox } from "element-ui";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      version: "AzerothCore",
    };
  },
  computed: {
    ...mapState("launcher", ["mysqld", "authServer", "worldServer"]),
  },
  methods: {
    ...mapActions("launcher", [
      "updateMysqld",
      "updateAuthServer",
      "updateWorldServer",
      "checkProcesses",
    ]),
    enterGame() {
      ipcRenderer.send("ENTER_GAME");
    },
    handleCommand(command) {
      switch (command) {
        case "start-mysqld":
          this.msyql = "";
          ipcRenderer.send("START_MYSQLD");
          break;
        case "start-auth-server":
          this.auth = "";
          ipcRenderer.send("START_AUTH_SERVER");
          break;
        case "start-world-server":
          this.world = "";
          ipcRenderer.send("START_WORLD_SERVER");
          break;
        case "start-all":
          this.world = "";
          ipcRenderer.send("START_ALL");
          break;
        case "start-client":
          this.world = "";
          ipcRenderer.send("START_CLIENT");
          break;
        case "stop-mysqld":
          ipcRenderer.send("STOP_MYSQLD");
          break;
        case "stop-auth-server":
          ipcRenderer.send("STOP_AUTH_SERVER");
          break;
        case "stop-world-server":
          ipcRenderer.send("STOP_WORLD_SERVER");
          break;
        case "stop-all":
          ipcRenderer.send("STOP_ALL");
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      let element = this.$refs["mysqldCard"].$el;
      element.scrollTop = element.scrollHeight;
      element = this.$refs["authServerCard"].$el;
      element.scrollTop = element.scrollHeight;
      element = this.$refs["worldServerCard"].$el;
      element.scrollTop = element.scrollHeight;
    });
    ipcRenderer.on("CHECK_PROCESSES", (event, response) => {
      this.checkProcesses(response);
    });
    ipcRenderer.on("MYSQLD_CONSOLE", (event, response) => {
      this.updateMysqld(response);
      this.$nextTick(() => {
        let element = this.$refs["mysqldCard"].$el;
        element.scrollTop = element.scrollHeight;
      });
    });
    ipcRenderer.on("AUTH_SERVER_CONSOLE", (event, response) => {
      this.updateAuthServer(response);
      this.$nextTick(() => {
        let element = this.$refs["authServerCard"].$el;
        element.scrollTop = element.scrollHeight;
      });
    });
    ipcRenderer.on("WORLD_SERVER_CONSOLE", (event, response) => {
      this.updateWorldServer(response);
      this.$nextTick(() => {
        let element = this.$refs["worldServerCard"].$el;
        element.scrollTop = element.scrollHeight;
      });
    });
    ipcRenderer.on("GLOBAL_MESSAGE", (event, response) => {
      MessageBox.alert(response, "未知错误", {
        confirmButtonText: "确定",
      });
    });
  },
};
</script>
