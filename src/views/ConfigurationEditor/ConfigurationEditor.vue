<template>
  <el-row :gutter="16">
    <el-col :span="6">
      <el-card style="height: 789px;">
        <el-menu
          default-active="world-server"
          style="border-right: none !important"
          @select="navigate"
        >
          <el-menu-item index="world-server">
            <i class="el-icon-setting"></i>
            <span slot="title">World Server</span>
          </el-menu-item>
          <el-menu-item index="auth-server">
            <i class="el-icon-setting"></i>
            <span slot="title">Auth Server</span>
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
      this.$router.push(`/configuration-editor/${index}`).then(() => {});
    },
  },
  mounted() {
    this.navigate("world-server");
  },
};
</script>

<style>
.el-form-item__label {
  text-align: left;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
