<template>
  <el-card style="margin: 0 0 0 16px;padding: 300px;text-align:center">
    <h1>LAUNCHER</h1>
    This is a launcher used to start game and useful tools in a single place.
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
