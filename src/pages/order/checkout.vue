<template>
  <van-dialog
      :use-slot="true"
      title="标题"
      :show="show"
      show-cancel-button
      confirm-button-open-type="getUserInfo"
      @close="onClose"
      @getuserinfo="getUserInfo"
  >
    <view>返回就取消订单</view>
  </van-dialog>
  <view>
    <!-- 显示导航栏加载动画 -->
    <view  @click="onNavigateBack">
      <image style=" margin-top: 50rpx; height: 70rpx;width: 70rpx" src="../../static/images/back.png"></image>
    </view>
  </view>
  <view>
    请在时间内支付，超时自动取消订单
    <van-count-down :time="time"/>

  </view>

  <view v-for="it in shopList" :key="it.id">
    <van-card
        v-if="it.selectNum > 0"
        :num="it.selectNum"
        :price="it.price"
        :desc="it.intro"
        :title="it.name"
        :thumb="it.picture"
    />
  </view>

  <van-field v-model="remark" label="备注" placeholder="如有需要请填写"/>
  <van-radio-group v-model="radio" @change="onChange">
    <van-radio :use-icon-slot="true" :value="radio" name="1" checked-color="#ee0a24">
      支付宝支付
      <template #icon>
        <img class="img-icon" src="../../static/images/zfb.png"/>
      </template>
    </van-radio>
    <van-radio :use-icon-slot="true" :value="radio" name="2">
      微信支付
      <template #icon>
        <img class="img-icon" src="../../static/images/wx.png"/>
      </template>
    </van-radio>
  </van-radio-group>
  <view style="height: 50rpx"></view>

  <van-submit-bar :price="amount * 100" button-text="支付" @submit="onSubmit"/>
  <van-dialog id="van-dialog" />

</template>

<script>
import localStorage from "../../utils/localStorage";
import {createOrder, submitOrder} from "../../api/order";


export default {
  name: "checkout",

  data() {
    return {
      show:false,
      time: 30 * 60 * 60 * 1000,
      shopList: [],
      amount: 0,
      remark: '',
      orderNo: '',
      radio: 1,
      icon: {
        active: '',
        normal: 'https://img01.yzcdn.cn/vant/user-active.png'
      }
    }
  },
  methods: {
    getUserInfo(event) {
      uni.navigateBack()
    },
    onClose() {
      this.show = false
    },
    onNavigateBack() {
      this.show = true
    },

    //就当做已经付款，沒做支付功能
    onSubmit() {
      submitOrder(this.orderNo, this.radio)
    },
    onChange(event) {
      this.radio = event.detail
      console.log(this.radio)
    }
  },
  onLoad() {
    const shopList = localStorage.get('shopList')
    const amount = localStorage.get('amount')
    const tableId = localStorage.get('tableId')
    const param = {shopList, amount, tableId}
    this.shopList = shopList

    createOrder(param).then(res => {
      this.orderNo = res
      console.log(res)
    })
  }
}
</script>

<style scoped>
.img-icon {
  height: 120rpx;
  width: 120rpx;
}
</style>
