<template>
  <el-card style="height: 789px; margin: 0 0 0 16px;overflow: auto;">
    <el-row :gutter="16">
      <el-form :model="worldserverConfiguration">
        <el-col :span="8" :key="label" v-for="label in worldLabels">
          <el-form-item>
            <span slot="label">
              {{ label }}
            </span>
            <el-input
              v-model="worldserverConfiguration[label]"
              :placeholder="label"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      worldserverConfiguration: {},
      worldLabels: [],
    };
  },
  methods: {
    async init() {
      const dotConf = window.dotConf;

      dotConf
        .read("D:\\FoxWoW\\Server\\Core\\configs\\worldserver.conf")
        .then((conf) => {
          this.worldserverConfiguration = conf.worldserver;
          this.worldLabels = Object.keys(conf.worldserver);
        });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
