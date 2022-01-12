<template>
  <div style="height: 789px; margin: 0 0 0 16px;overflow: auto;">
    <el-card>
      <el-form :model="path" label-width="120px">
        <el-form-item label="Foxy">
          <el-input v-model="path.foxy"
            ><el-button slot="append">指定路径</el-button></el-input
          >
        </el-form-item>
        <el-form-item label="MPQ Editor">
          <el-input v-model="path.mpqEditor"
            ><el-button slot="append">指定路径</el-button></el-input
          >
        </el-form-item>
        <el-form-item label="Navicat">
          <el-input v-model="path.navicat"
            ><el-button slot="append">指定路径</el-button></el-input
          >
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
