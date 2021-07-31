<template>
  <el-card style="height: 789px; margin: 0 0 0 16px;overflow: auto;">
    <el-row :gutter="16">
      <el-form :model="authserverConfiguration">
        <el-col :span="8" :key="label" v-for="label in authLabels">
          <el-form-item :label="label">
            <el-input
              v-model="authserverConfiguration[label]"
              :placeholder="label"
            ></el-input>
          </el-form-item> </el-col
      ></el-form>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      authserverConfiguration: {},
      authLabels: [],
    };
  },
  methods: {
    async init() {
      const dotConf = window.dotConf;

      dotConf
        .read("D:\\FoxWoW\\Server\\Core\\configs\\authserver.conf")
        .then((conf) => {
          this.authserverConfiguration = conf.authserver;
          this.authLabels = Object.keys(conf.authserver);
        });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
