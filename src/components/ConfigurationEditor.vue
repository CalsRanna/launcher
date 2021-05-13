<template>
  <el-dialog
    title="配置编辑器"
    width="80%"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-tabs tab-position="left" :value="tab">
      <el-tab-pane label="authserver" name="authserver">
        <el-card>
          <el-row :gutter="16" style="max-height: 60vh;overflow: auto;">
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
      </el-tab-pane>
      <el-tab-pane label="worldserver" name="worldserver">
        <el-card>
          <el-row :gutter="16" style="max-height: 60vh;overflow: auto;">
            <el-form :model="worldserverConfiguration">
              <el-col :span="12" :key="label" v-for="label in worldLabels">
                <el-form-item :label="label">
                  <el-input
                    v-model="worldserverConfiguration[label]"
                    :placeholder="label"
                  ></el-input>
                </el-form-item> </el-col
            ></el-form>
          </el-row>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      tab: "authserver",
      authserverConfiguration: {},
      worldserverConfiguration: {},
      authLabels: [],
      worldLabels: [],
    };
  },
  props: {
    visible: {
      type: Boolean,
      defaultValue: false,
    },
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    async init() {
      const dotConf = window.require("@calsranna/dot-conf");

      dotConf
        .read("D:\\FoxWoW\\Server\\Core\\configs\\authserver.conf")
        .then((conf) => {
          this.authserverConfiguration = conf.authserver;
          this.authLabels = Object.keys(conf.authserver);
        });

      dotConf
        .read("D:\\FoxWoW\\Server\\Core\\configs\\worldserver.conf")
        .then((conf) => {
          this.worldserverConfiguration = conf.worldserver;
          this.worldLabels = Object.keys(conf.worldserver);
        });
    },
  },
  created() {
    this.init();
  },
};
</script>
