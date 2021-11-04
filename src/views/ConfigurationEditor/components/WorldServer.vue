<template>
  <div style="margin: 0 0 0 16px;">
    <el-card>
      <el-form :model="credential">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-input v-model="credential.field" placeholder="field" />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="filter">过滤</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top: 16px; height: 610px; overflow: auto;">
      <el-row :gutter="16">
        <el-form :model="worldserverConfiguration">
          <el-col :span="8" :key="label" v-for="label in filteredLabels">
            <el-form-item :label="label">
              <el-input
                v-model="worldserverConfiguration[label]"
                :placeholder="label"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-card>
    <el-card style="margin-top: 16px">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button>重置</el-button>
    </el-card>
  </div>
</template>

<script>
import { Notification } from "element-ui";
export default {
  data() {
    return {
      credential: {
        field: "",
      },
      filteredLabels: [],
      worldserverConfiguration: {},
      worldLabels: [],
    };
  },
  methods: {
    filter() {
      if (this.credential.field === "") {
        this.filteredLabels = Object.keys(this.worldserverConfiguration);
      } else {
        this.filteredLabels = [];
        for (let i = 0; i < this.worldLabels.length; i++) {
          if (this.worldLabels[i].includes(this.credential.field)) {
            this.filteredLabels.push(this.worldLabels[i]);
          }
        }
      }
    },
    submit() {
      const dotConf = window.dotConf;

      dotConf
        .write("D:\\FoxWoW\\Server\\Core\\configs\\worldserver.conf", {
          worldserver: this.worldserverConfiguration,
        })
        .then(() => {
          Notification({
            title: "保存成功",
            type: "success",
          });
        });
    },
    async init() {
      const dotConf = window.dotConf;

      dotConf
        .read("D:\\FoxWoW\\Server\\Core\\configs\\worldserver.conf")
        .then((conf) => {
          this.worldserverConfiguration = conf.worldserver;
          this.worldLabels = Object.keys(conf.worldserver);
          this.filteredLabels = this.worldLabels;
        });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
