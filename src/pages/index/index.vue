<template>
  <view>
    <button @click="open">打开弹窗</button>
    <uni-popup ref="popup" type="bottom">底部弹出 Popup</uni-popup>
  </view>
</template>

<script>
export default {
  methods:{
    open(){
      // 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
      this.$refs.popup.open('top')
    }
  }
}
</script>
