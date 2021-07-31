<template>
  <el-card style="height: 789px; margin: 0 0 0 16px;overflow: auto;">
    <el-form label-width="120px">
      <el-form-item label="Foxy">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="MPQ Editor">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="Navicat">
        <el-input></el-input>
      </el-form-item>
    </el-form>
  </el-card>
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
