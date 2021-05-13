<template>
  <div>
    <el-container>
      <div
        style="height: 16px;text-align: right;line-height: 16px;margin: 8px 0;"
      >
        <el-button type="text" size="mini" style="padding: 0" @click="exit">
          <i class="el-icon-close" style="font-size: 16px;"></i>
        </el-button>
      </div>
      <el-header class="header">
        <el-button icon="el-icon-s-grid" @click="navigate('launcher')"
          >登录游戏</el-button
        >
        <el-button
          icon="el-icon-edit"
          style="margin-left: 8px;"
          @click="openConfigEditor"
        >
          配置编辑
        </el-button>
        <el-button
          icon="el-icon-setting"
          style="margin-left: 8px;"
          @click="navigate('setting')"
        >
          设置
        </el-button>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <configuration-editor
      :visible="editorVisible"
      @close="closeConfigEditor"
    ></configuration-editor>
  </div>
</template>

<script>
const ipcRenderer = window.ipcRenderer;

import ConfigurationEditor from "@/components/ConfigurationEditor";

export default {
  data() {
    return {
      editorVisible: false,
    };
  },
  methods: {
    exit() {
      ipcRenderer.send("EXIT_APP");
    },
    openConfigEditor() {
      this.editorVisible = true;
    },
    closeConfigEditor() {
      this.editorVisible = false;
    },
    navigate(module) {
      this.$router.push(`/${module}`).then(() => {});
    },
  },
  components: {
    ConfigurationEditor,
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0 16px 16px 16px;
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
.el-card__body {
  padding: 16px !important;
}
.el-dropdown > .el-button-group > .el-button:first-child {
  width: 131px;
}
</style>
