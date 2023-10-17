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
    <view @click="onNavigateBack">
      <image style=" margin-top: 50rpx; height: 70rpx;width: 70rpx" src="../../static/images/back.png"></image>
    </view>
  </view>
  <view>
    请在时间内支付，超时自动取消订单
    <van-count-down ref="countDown" :time="time"/>

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
  <van-radio-group v-model="payType" @change="onChange">
    <van-radio :use-icon-slot="true" :value="payType" name="1" checked-color="#ee0a24">
      支付宝支付
      <template #icon>
        <img class="img-icon" src="../../static/images/zfb.png"/>
      </template>
    </van-radio>
    <van-radio :use-icon-slot="true" :value="payType" name="2">
      微信支付
      <template #icon>
        <img class="img-icon" src="../../static/images/wx.png"/>
      </template>
    </van-radio>
  </van-radio-group>
  <view style="height: 50rpx"></view>

  <van-submit-bar :price="amount * 100" button-text="支付" @submit="onSubmit"/>

  <view>
    <!-- 提示信息弹窗 -->
    <uni-popup ref="message" type="message">
      <uni-popup-message type="error" message="订单已超时" :duration="2000"></uni-popup-message>
    </uni-popup>
  </view>


</template>

<script>
import localStorage from "../../utils/localStorage";
import {createOrder, submitOrder} from "../../api/order";
import websocketUtil from "../../utils/websocketUtil"

export default {
  name: "checkout",

  data() {
    return {
      type: 'center',
      msgType: 'success',
      messageText: '这是一条成功提示',
      value: '',
      show: false,
      time: 30000,
      shopList: [],
      amount: 0,
      remark: '',
      orderNo: '',
      payType: 1,
      icon: {
        active: '',
        normal: 'https://img01.yzcdn.cn/vant/user-active.png'
      },
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
      //倒计时时间
      if (this.$refs.countDown.remain > 0) {
        submitOrder(this.orderNo, this.payType)
        uni.$emit('refresh', {refresh: true});
        uni.navigateBack()
      } else {
        // 使用setTimeout函数延时执行代码
        this.$refs.message.open()
        setTimeout(function () {
          uni.$emit('refresh', {refresh: true});
          uni.navigateBack()
        }, 500);


      }

    },
    onChange(event) {
      this.payType = event.detail
      console.log(this.payType)
    }
  },

  onLoad() {
    const shopList = localStorage.get('shopCarList')
    const amount = localStorage.get('amount')
    const tableId = localStorage.get('tableId')
    const param = {createOrder: "", shopList, amount, tableId}
    this.shopList = shopList
    this.amount = amount

    this.$socket.send(JSON.stringify(param));

    // createOrder(param).then(res => {
    //   this.orderNo = res
    //   console.log(res)
    // })
    this.$socket.getMessage(res => {


      const data = (JSON.parse(res.data))
      console.log(data)
      if (typeof data === "string") {
        if (data === "订单创建成功")  {
          console.log("*-*-*-*")
        }


      }
    })
  }
}
</script>

<style scoped>
.img-icon {
  height: 120 rpx;
  width: 120 rpx;
}
</style>
