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
            <el-button slot="append">指定路径</el-button></el-input
          >
        </el-form-item>
        <el-form-item label="World Server">
          <el-input v-model="path.worldServer">
            <el-button slot="append">指定路径</el-button></el-input
          >
        </el-form-item>
        <el-form-item label="Auth Server">
          <el-input v-model="path.authServer">
            <el-button slot="append">指定路径</el-button></el-input
          >
        </el-form-item>
        <el-form-item label="Client">
          <el-input v-model="path.client">
            <el-button slot="append">指定路径</el-button></el-input
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button type="danger">删除</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
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
      mysql: localStorage.getItem("mysql_path"),
      worldServer: localStorage.getItem("world_server_path"),
      authServer: localStorage.getItem("auth_server_path"),
      client: localStorage.getItem("client_path"),
    };
  },
};
</script>
