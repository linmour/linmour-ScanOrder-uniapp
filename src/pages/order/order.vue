<template>

  <view>
    <!-- 提示信息弹窗 -->
    <uni-popup ref="message" type="message">
      <uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
    </uni-popup>
  </view>

  <view>
    <!-- 顶部提示窗示例 -->
    <uni-popup ref="alertDialog">
      <uni-popup-dialog ></uni-popup-dialog>
    </uni-popup>
  </view>

  <view>
    <!-- 授权提示窗示例 -->
    <uni-popup ref="alertDialog" type="dialog">
      <uni-popup-dialog :type="msgType" cancelText="关闭" confirmText="同意" title="需要获取授权" content="" @confirm="Login"
                        @close="dialogClose"></uni-popup-dialog>
    </uni-popup>
  </view>

  <view>
    <van-notice-bar v-if="notice" mode="closeable" text="没有选择商品"/>

    <view class="ld">
      <view class="left">

        <van-sidebar>
          <view v-for="(item, index) in sortList" :key="index">
            <van-sidebar-item :title="item.sort" custom-class="cellTab" @click="onChange(item.id)"/>
          </view>

        </van-sidebar>
      </view>
      <view class="right" style="margin-left: 20rpx">

        <view v-for="(item, index) in productList" :key="index">
          <van-card
              v-if="item.sortId === sortId"
              style="height: 150rpx"
              :price="item.price"
              :desc="item.intro"
              :thumb="(item.picture).split(',')[0]"
              :title="item.name"
          >
            <template #tags>
              <van-tag plain type="danger">标签</van-tag>
              <van-tag plain type="danger">标签</van-tag>
            </template>

            <template #footer>
              <van-button v-if="item.selectNum === 0" @click="select(index)" size="mini">选择</van-button>
              <!--              数字加减栏        :value="it.selectNum" @input="setValue"  这两个很关键，要不然步进器显示的值不会改变                                 -->
              <van-stepper v-else :value="item.selectNum" @input="setValue" disable-input :long-press="false"
                           style="  position: absolute;top: 170rpx;right: 20rpx;" theme="round"
                           @minus="minus(index)" @plus="add(index)" @overlimit="minus(index)"/>

              <van-icon/>

            </template>

          </van-card>
          <view style="height: 5rpx;color: #999999"> {{ this.tableId }}</view>
        </view>

      </view>

    </view>
    <!--  下边栏-->

    <van-goods-action>
      <view style="width: 50px"></view>
      <van-goods-action-icon icon="cart-o" :info="shopNum" text="购物车" @click="shopCar"/>
      <view style="width: 100px"></view>
      <view style="width: 50px">￥ {{ amount }}</view>
      <van-goods-action-button text="立即购买" @click="submit"/>
      <view style="width: 30px"></view>
    </van-goods-action>

    <!--    购物车弹窗-->
    <van-action-sheet @click-overlay="cancel" @close="cancel" v-model:show="show" title="购物车">
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
    </van-action-sheet>
  </view>


</template>

<script>
import {getProductList, getProductSort} from "../../api/product/index";
import shopCarImg from '@/static/images/shop.png';
import localStorage from "../../utils/localStorage.js";
import {login} from "../../api/login";


export default {
  data() {
    return {
      notice: false,
      amount: 0,
      show: false,
      shopNum: 0,
      shopCarList: [],
      shopCarImg,
      active: 0,
      number: 0,
      shopId: 0,
      sortId: 0,
      sortList: [],
      productListBySortId: [],
      productList: [],
      windowHeight: '0rpx',
      currentNum: 0,
      index: '',
      tableId: 0,
      type: 'center',
      msgType: 'success',
      messageText: '这是一条成功提示',
      value: ''
    };
  },
  methods: {

    onChange(sortId) {
      this.sortId = sortId
    },
    cancel() {
      this.show = false
    },
    shopCar() {
      this.show = true
    },
    submit() {
      if (this.amount === 0) {
        this.notice = true
      }
      setTimeout(() => {
        this.notice = false
      }, 1000);
      if (this.shopCarList.length > 0) {
        localStorage.set('amount', this.amount)
        uni.navigateTo({
          url: `/pages/order/checkout`
        })
      }

    },
    updateShopList(m, type) {
      if (type === '-') {
        this.amount = this.amount - m.price
      } else {
        this.amount = this.amount + m.price
      }
      let flag = true;
      //同步购物车信息，对比购物车是否有这种物品，如果有就 +1 ,没有就加入数组
      if (this.shopCarList !== '') {
        this.shopCarList.forEach(function (obj, j) {
          if (m.id === obj.id) {
            this.shopCarList[j].selectNum = m.selectNum;
            flag = !flag;
          }
        }, this);

      }
      if (flag) {
        this.shopCarList.push(m);
      }
      localStorage.set("shopCarList", this.shopCarList)
    },

    add(index) {
      const a = {change: "",  productId: index, type: "+"}
      this.$socket.send(JSON.stringify(a))
    },
    minus(index) {
      if (this.productList[index].selectNum > 0) {
        const a = {change: "",  productId: index, type: "-"}
        this.$socket.send(JSON.stringify(a))
      }

    },
    select(index) {
      const a = {change: "", productId: index, type: "+"}
      this.$socket.send(JSON.stringify(a))
    },
    setValue(index, val) {
      this.productListBySortId[index].selectNum = val;
    },
    productDetail() {
      uni.navigateTo({
        url: `/pages/order/detail`
      })
    },
    messageToggle(type,msg) {
      this.msgType = type
      this.messageText = msg
      this.$refs.message.open()
    },


    //跳转回来页面刷新,清空数据
    onShow() {
      uni.$on('refresh', async (data) => {
        if (data.refresh) {
          this.sortList = await getProductSort()

          //获取默认菜单
          const res = getProductList()
          let sortId = res.list[0].sortId
          for (let i = 0; i < this.sortList.length; i++) {
            if (this.sortList[i].id === sortId) {
              this.currentNum = i
              this.index = sortId
            }
          }
          this.productListBySortId = res.list
          this.shopCarList = []
          this.shopNum = 0
          this.amount = 0
        }
      });
    },

    getUserInfo() {
      return new Promise((resolve, reject) => {
        wx.getUserProfile({
          lang: 'zh_CN',
          desc: '用户登录',
          success: (res) => {
            resolve(res.userInfo)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    },

    getLogin() {
      return new Promise((resolve, reject) => {
        wx.login({
          success(res) {
            resolve(res.code)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    },

    Login() {
      let userInfo = this.getUserInfo();
      let wxCode = this.getLogin();
      Promise.all([userInfo, wxCode]).then((res) => {
        //带上信息去后端请求登录
        login(res[1],res[0].nickName,res[0].avatarUrl).then((res)=>{
          localStorage.set("openid",res)
        })
      }).catch(err => {

      })
    },

    dialogClose() {
      console.log('点击关闭')
    },

  },

  async onLoad(options) {
    if (localStorage.get("openid") === "")
    this.$refs.alertDialog.open()

    //二维码携带的参数
    if (options && options.scene) {
      const scene = decodeURIComponent(options.scene);
      const param = scene.split(":")
      console.log(param)
      this.shopId = param[1]
      this.tableId = param[2]
      localStorage.set('tableId', param[2])
      localStorage.set('shopId', param[1])
    }

    //获取分类
    this.sortList = await getProductSort()

    //获取默认菜单
    const res = await getProductList()
    this.sortId = res[0].sortId
    for (let i = 0; i < this.sortList.length; i++) {
      if (this.sortList[i].id === this.sortId) {
        this.currentNum = i
        this.index = this.sortId
      }
    }
    this.productList = res


    let _that = this;
    uni.getSystemInfo({
      success: function (res) {
        _that.windowHeight = res.windowHeight + 'px';
      }
    });


    this.$socket.changeUrl("ws://127.0.0.1:12800/websocket/table/" + this.tableId)


    /**
     * 全局中使用同一个 WebSocket 对象，那么无论在哪个页面添加监听事件，该监听事件都能监听到后端发送的 WebSocket 消息
     */
    this.$socket.getMessage(res => {

      const data = (JSON.parse(res.data))
      console.log(res,"-------W")
      if (typeof data === "object") {
        console.log("======================同步购物车======================")
        data.forEach(res => {
          if (res.type === '+') {
            this.shopNum++;
            this.productList[res.productId].selectNum++;
          } else {
            this.shopNum--;
            this.productList[res.productId].selectNum--;
          }
          const m = this.productList[res.productId];
          this.updateShopList(m, res.type);
        })

      } else if (typeof data === "string") {
        if (data === "订单提交成功") {
          const a = {clear: ""}
          //通知后端可以提交新的订单了
          this.$socket.send(JSON.stringify(a))
          localStorage.remove("shopCarList")
          localStorage.remove("amount")
          this.shopCarList = []
          this.shopNum = 0
          this.productList.forEach(m => m.selectNum = 0)
          this.amount = 0
          uni.$emit('refresh', {refresh: true});
          uni.navigateBack()
          this.messageToggle("success",data)

        } else if (data === "已有人提交订单，请稍后") {
          this.messageToggle("warn",data)

        }else if (data === '订单提交失败'){
          uni.$emit('refresh', {refresh: true});
          uni.navigateBack()
          this.messageToggle("error",data)
        }
      }
    })
  },


};
</script>

<style>
.a {
  height: 50 rpx;
}

.button {
  border-radius: 50%;
  width: 10 rpx;
  height: 10 rpx;
  padding: 0;
  background-color: #007aff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  position: absolute;
  top: 130 rpx;
  right: 1 rpx;
}

.ld {
  display: flex;
}

.ld .left {
  width: 130 rpx;
  background-color: #f5f5f5;
}

.ld .left .title {
  text-align: center;
  height: 70 rpx;
  line-height: 70 rpx;
  color: #000000;
}

.ld .left .active {
  background-color: #ffffff;
  color: #000000;
}

.ld .right {
  flex: 1;
}

.ld .right .title {
  color: #dd524d;
  padding: 20 rpx;
  font-weight: 700;
}

.ld .right .item {
  padding-left: 20 rpx;
  display: inline-block;
  height: 350 rpx;
}
</style>

