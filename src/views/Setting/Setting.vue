<template>
  <el-row :gutter="16">
    <el-col :span="6">
      <el-card style="height: 789px;">
        <el-menu
          default-active="app"
          style="border-right: none !important"
          @select="navigate"
        >
          <el-menu-item index="app">
            <i class="el-icon-menu"></i>
            <span slot="title">应用</span>
          </el-menu-item>
          <el-menu-item index="game">
            <i class="el-icon-document"></i>
            <span slot="title">游戏设置</span>
          </el-menu-item>
          <el-menu-item index="conf">
            <i class="el-icon-setting"></i>
            <span slot="title">配置</span>
          </el-menu-item>
          <el-menu-item index="about" style="border-top: solid 1px #DCDFE6">
            <i class="el-icon-warning-outline"></i>
            <span slot="title">关于</span>
          </el-menu-item>
        </el-menu>
      </el-card>
    </el-col>
    <el-col :span="18">
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    navigate(index) {
      this.$router.push(`/setting/${index}`).then(() => {});
    },
  },
};
</script>
