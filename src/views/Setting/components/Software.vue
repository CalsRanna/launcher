<template>
  <div style="height: 789px; margin: 0 0 0 16px;overflow: auto;">
    <el-card>
      <el-form label-width="120px">
        <el-form-item label="Foxy">
          <el-input><el-button slot="append">选择文件</el-button></el-input>
        </el-form-item>
        <el-form-item label="MPQ Editor">
          <el-input><el-button slot="append">选择文件</el-button></el-input>
        </el-form-item>
        <el-form-item label="Navicat">
          <el-input><el-button slot="append">选择文件</el-button></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
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
