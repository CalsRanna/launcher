<template>
  <el-card style="margin: 0 0 0 16px;padding: 64px;text-align:center">
    <h2>Launcher</h2>
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
