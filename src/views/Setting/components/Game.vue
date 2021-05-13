<template>
  <el-card style="height: 789px; margin: 0 0 0 16px;overflow: auto;">
    <el-form label-width="120px">
      <el-form-item label="Mysqld">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="authserver">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="worldserver">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="Wow">
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
