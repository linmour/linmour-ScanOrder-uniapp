<template>
  <van-button type="primary" text="组件调用" @click="showNotify" />
  <van-notify v-model="show" type="success">
    <van-icon name="bell" style="margin-right: 4px;" />
    <span>通知内容</span>
  </van-notify>
  <van-notify id="custom-selector" />
</template>
<script>
export default {
  data() {
    return {
      show: false,
    };
  },
  methods: {
    showNotify() {
      this.show = true;
      setTimeout(() => {
        this.show = false;
      }, 2000);
    },
  },
};
</script>
<style>

</style>

