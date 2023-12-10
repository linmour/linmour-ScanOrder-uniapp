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
  </van-dialog>
<!--  <view>-->
<!--    &lt;!&ndash; 显示导航栏加载动画 &ndash;&gt;-->
<!--    <view @click="onNavigateBack">-->
<!--      <image style=" margin-top: 50rpx; height: 70rpx;width: 70rpx" src="../../static/images/back.png"></image>-->
<!--    </view>-->
<!--  </view>-->
<!--  <view>-->
<!--    请在时间内支付，超时自动取消订单-->
<!--    <van-count-down ref="countDown" :time="time"/>-->

<!--  </view>-->

<!--  <view v-for="it in shopList" :key="it.id">-->
<!--    <van-card-->
<!--        v-if="it.selectNum > 0"-->
<!--        :num="it.selectNum"-->
<!--        :price="it.price"-->
<!--        :desc="it.intro"-->
<!--        :title="it.name"-->
<!--        :thumb="it.picture"-->
<!--    />-->
<!--  </view>-->

<!--  <van-radio-group v-model="payType" @change="onChange">-->
<!--    <van-radio :use-icon-slot="true" :value="payType" name="1" checked-color="#ee0a24">-->
<!--      支付宝支付-->
<!--      <template #icon>-->
<!--        <img class="img-icon" src="../../static/images/zfb.png"/>-->
<!--      </template>-->
<!--    </van-radio>-->
<!--    <van-radio :use-icon-slot="true" :value="payType" name="2">-->
<!--      微信支付-->
<!--      <template #icon>-->
<!--        <img class="img-icon" src="../../static/images/wx.png"/>-->
<!--      </template>-->
<!--    </van-radio>-->
<!--  </van-radio-group>-->
<!--  <view style="height: 50rpx"></view>-->

<!--  <van-submit-bar :price="amount * 100" button-text="支付" @submit="onSubmit"/>-->

<!--  <view>-->
<!--    &lt;!&ndash; 提示信息弹窗 &ndash;&gt;-->
<!--    <uni-popup ref="message" type="message">-->
<!--      <uni-popup-message type="error" message="订单已超时" :duration="2000"></uni-popup-message>-->
<!--    </uni-popup>-->
<!--  </view>-->
  <view v-for="it in shopCarList" :key="it.id">
    <van-card
        v-if="it.selectNum > 0"
        :num="it.selectNum"
        :price="it.price"
        :desc="it.intro"
        :title="it.name"
        :thumb="it.picture"
    />
  </view>
{{remark}}
<!--  <van-field v-model="remark" label="备注" placeholder="如有需要请填写"/>-->
  <uni-easyinput v-model="remark" placeholder="请输入内容"></uni-easyinput>


  <van-goods-action>
    <view style="width: 300rpx"></view>
    <van-goods-action-button color="#656564" type="warning" text="继续点餐" @click="order"/>
    <van-goods-action-button color="#be99ff" type="danger" text="结账"  @click="onSubmit"/>
  </van-goods-action>


</template>

<script>
import localStorage from "../../utils/localStorage";
import {checkout} from "../../api/order";
// import {createOrder, submitOrder} from "../../api/order";
// import websocketUtil from "../../utils/websocketUtil"

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
      shopCarList: [],
      tableId:0,
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
    order(){
      console.log("*-*--")
      const shopCarList = this.shopCarList
      const amount = this.amount
      const tableId = this.tableId
      const  remark = this.remark
      const param = {createOrder: "",shopCarList , amount, tableId,remark}
      this.$socket.send(JSON.stringify(param));

    },
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
      this.order()
      const  openid = localStorage.get("openid")
      checkout(this.tableId, this.payType,openid)
    },
    onChange(event) {
      this.payType = event.detail
      console.log(this.payType)
    }
  },

  onLoad() {
    this.shopCarList = localStorage.get('shopCarList')
    this.amount = localStorage.get('amount')
    this.tableId = localStorage.get('tableId')
  }
}
</script>

<style scoped>
.img-icon {
  height: 120 rpx;
  width: 120 rpx;
}
</style>
