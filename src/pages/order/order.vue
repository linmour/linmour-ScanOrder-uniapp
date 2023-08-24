<template>
  <view>
    <van-notice-bar @close="m" v-if="a.length === 0" mode="closeable" text="没有选择商品" />

    <view class="ld">
      <view class="left">
<!--        侧边栏-->
        <scroll-view :scroll-y="true" :scroll-with-animation="true" :scroll-into-view="clickToId" :style="{ height: windowHeight }">
          <view v-for="(item, index) in sortList" :key="index">
            <view :class="['title', { active: index === currentNum }]" :id="'to' + index" @click="setId(index,item.id)"
                  style="border-radius: 10rpx; ">{{ item.sort }}</view>
          </view>
        </scroll-view>
      </view>
      <view class="right" style="margin-left: 20rpx">
        <scroll-view :scroll-into-view="clickId" @scroll="scroll" :scroll-with-animation="true" :scroll-y="true" :style="{ height: windowHeight }">
          <view v-for="(it, idx) in productList" :key="idx" style="margin-top: 5rpx">
            <view style="position: relative; margin-top: 10rpx" >
              <view @click="productDetail">
                  <van-image
                      width="100"
                      height="100"
                      radius="10px"
                      :src="it.picture"
                  />
                <view style="position: absolute; font-weight: bold; top: 0; right: calc(50rpx - {{ it.name.length }}ch); width: 100%; text-align: center;">{{ it.name }}</view>
                <text  style="position: absolute;  top: 45rpx; right: 10rpx; width: 100%; text-align: center; font-size: 20rpx">{{ it.intro }}</text>
                <text>{{ it.price }}</text>
                </view>
              <!--               +按钮-->
              <button v-if="it.selectNum === 0" @click.stop="select(idx)" class="button">+</button>

<!--              数字加减栏        :value="it.selectNum" @input="setValue"  这两个很关键，要不然步进器显示的值不会改变                                 -->
              <van-stepper  :value="it.selectNum" @input="setValue" disable-input style="  position: absolute;top: 160rpx;right: 50rpx;" v-else theme="round"  @minus="minus(idx)" @plus="add(idx)" @overlimit="minus(idx)"/>

            </view>
            <view >
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
<!--  下边栏-->

    <van-goods-action>
      <view style="width: 50px"></view>
      <van-goods-action-icon icon="cart-o" :info="shopNum" text="购物车" @click="shopCar" />
      <view style="width: 100px"></view>
      <view style="width: 50px">￥ {{ amount }}</view>
      <van-goods-action-button text="立即购买" @click="submit" />
      <view style="width: 30px"></view>
    </van-goods-action>

<!--    购物车弹窗-->
    <van-action-sheet  @click-overlay="cancel" @close="cancel" v-model:show="show" title="购物车">
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
    </van-action-sheet>
  </view>


</template>

<script>
import {getProductList, getProductSort} from "../../api/product/index";
import shopCarImg from '@/static/images/shop.png';
import localStorage from "../../utils/localStorage.js";
import {createOrder} from "../../api/order";
export default {
  data() {
    return {
      a:[1],
      cahceIds:[],
      amount:0,
      show:false,
      shopNum:0,
      shopList:[],
      shopCarImg,
      active:0,
      number: 0,
      shopId:0,
      sortList: [],
      productList:[],
      windowHeight: '0rpx',
      clickId: '',
      clickToId: '',
      currentNum: 0,
      topList: [],
      isLeftClick: false,
      index:'',
    };
  },
  methods: {
    m(){
      this.a = [1]
    },
    cancel() {
      this.show = false
    },
    shopCar() {
      this.show = true
    },
    submit() {

       this.a  = this.shopList.filter(m => m.selectNum !== 0)
      console.log(this.a.length)
      if (this.a.length > 0){
        const amount  =this.amount
        localStorage.set('shopList',this.a)
        localStorage.set('amount',amount)
        uni.navigateTo({
          url: `/pages/order/checkout`
        })
      }

    },
    updateShopList(m,type) {
      if (type === '-'){
        this.amount = this.amount - m.price

      }else {
        this.amount = this.amount + m.price

      }
      for (let j = 0; j < this.shopList.length; j++) {
        let n = this.shopList[j];
        if (m.id === n.id) {
          this.shopList[j].selectNum = m.selectNum;
          return;
        }
      }
      this.shopList.push(m);
    },
    add(index) {
      this.shopNum++;
      const m = this.productList[index];
      this.productList[index].selectNum++;
      this.updateShopList(m,'+');
    },
    minus(index) {
      this.shopNum--;
      const m = this.productList[index];
      this.productList[index].selectNum--;
      this.updateShopList(m,'-');
    },
    select(index) {
      this.shopNum++;
      const m = this.productList[index];
      this.productList[index].selectNum++;
      this.updateShopList(m,"+");
    },
    setValue(index, val) {
      this.productList[index].selectNum = val;
    },
    productDetail() {
      uni.navigateTo({
        url: `/pages/order/detail`
      })
    },
    setId(index, sortId) {
      this.cahceIds.push(this.index.toString())
      localStorage.set(this.index.toString(), this.productList.map(m => m.selectNum));
      getProductList(this.shopId, sortId).then(res => {
        this.productList = res.list;
        let cacheArr = localStorage.get(sortId.toString());
        if (cacheArr !== undefined) {
          if (cacheArr && cacheArr.length === this.productList.length) {
            for (let i = 0; i < this.productList.length; i++) {
              this.productList[i].selectNum = cacheArr[i];
            }
          } else {
            console.log('缓存数据长度不符合预期');
          }
        } else {
          console.log('未找到缓存数据');
        }
        outerLoop: for (let i = 0; i < this.productList.length; i++) {
          const m = this.productList[i];
          for (let j = 0; j < this.shopList.length; j++) {
            const n = this.shopList[j];
            if (m.id === n.id) {
              n.selectNum = m.selectNum
              break outerLoop;
            }
          }
          this.shopList.push(m)
          console.log(this.shopList)
        }
        this.clickId = 'po' + index;
        this.isLeftClick = true;
        this.currentNum = index;
        this.index = sortId;
      });
    },
    scroll(e) {
      if (this.isLeftClick) {
        this.isLeftClick = false;
        return;
      }
      let scrollTop = e.target.scrollTop;
      for (let i = 0; i < this.topList.length; i++) {
        let h1 = this.topList[i];
        let h2 = this.topList[i + 1];
        if (scrollTop >= h1 && scrollTop < h2) {
          this.currentNum = i;
          this.clickToId = 'to' + i;
        }
        //解决滚动到最后选项左侧不会选中
        let length = this.topList.length;
        if (scrollTop >= this.topList[length - 1]) {
          this.currentNum = length - 1;
          this.clickToId = 'to' + length - 1;
        }
      }
    },
    getNodesInfo() {
      //获取节点为.right_title距离顶部的距离，返回值放在数组中
      const query = uni.createSelectorQuery().in(this);
      query
          .selectAll('.right_title')
          .boundingClientRect()
          .exec(res => {
            console.log(res);
            let nodes = res[0];
            let rel = [];
            nodes.map(item => {
              rel.push(item.top);
            });
            console.log(rel);
            this.topList = rel;
          });
    }
  },
  //跳转回来页面刷新,清空数据
  onShow() {
    uni.$on('refresh', (data) => {
      if (data.refresh) {
        getProductSort().then(res =>{
          this.sortList = res
        });
        //获取默认菜单
        getProductList(null).then(res => {
          let sortId = res.list[0].sortId
          for (let i = 0; i < this.sortList.length; i++) {
            if (this.sortList[i].id === sortId) {
              this.currentNum = i
              this.index = sortId
            }
          }
          this.productList = res.list
        })
        this.shopList = []
        this.shopNum = 0
        this.amount = 0
        this.cahceIds.forEach(m =>{
          localStorage.remove(m)
        })
      }
    });
  },

  onLoad(options) {
    if (options && options.scene) {
      const scene = decodeURIComponent(options.scene);
      const param  = scene.split(":")
      this.shopId = param[1]
      localStorage.set('tableId',param[2])
      localStorage.set('shopId',param[1])
    }
    //获取分类
    getProductSort().then(res =>{
      this.sortList = res
    });
    //获取默认菜单
    getProductList(null).then(res => {
      let sortId = res.list[0].sortId
      for (let i = 0; i < this.sortList.length; i++) {
        if (this.sortList[i].id === sortId) {
          this.currentNum = i
          this.index = sortId
        }
      }
      this.productList = res.list
    })
    let _that = this;
    uni.getSystemInfo({
      success: function(res) {
        _that.windowHeight = res.windowHeight + 'px';
      }
    });
    this.getNodesInfo();
  }
};
</script>

<style>
.a {
  height: 50rpx;
}
.button{
  border-radius: 50%;
  width: 48rpx;
  height: 48rpx;
  padding: 0;
  background-color: #007aff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  position: absolute;
  top: 130rpx;
  right: 50rpx;
}
.ld {
  display: flex;
}

.ld .left {
  width: 130rpx;
  background-color: #f5f5f5;
}

.ld .left .title {
  text-align: center;
  height: 70rpx;
  line-height: 70rpx;
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
  padding: 20rpx;
  font-weight: 700;
}

.ld .right .item {
  padding-left: 20rpx;
  display: inline-block;
  height: 350rpx;
}
</style>

