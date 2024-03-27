<template>
	<view class="container" v-if="!loading">
		<view>
			<!-- 提示信息弹窗 -->
			<uni-popup ref="message" type="message">
				<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
			</uni-popup>
		</view>

		<view>
			<!-- 顶部提示窗示例 -->
			<uni-popup ref="alertDialog">
				<uni-popup-dialog></uni-popup-dialog>
			</uni-popup>
		</view>

		<view class="main" v-if="goods.length">
			<view class="nav">
				<view class="header">
					<view class="left" v-if="orderType == 'takein'">
						<view class="store-name">
							<text>{{ store.name }}</text>
							<view class="iconfont iconarrow-right"></view>
						</view>
						<view class="store-location">
							<image src='/static/images/order/location.png' style="width: 30rpx; height: 30rpx;"
								class="mr-10"></image>
							<text>距离您 {{ store.distance_text }}</text>
						</view>
					</view>
					<view class="left overflow-hidden" v-else>
						<view class="d-flex align-items-center overflow-hidden">
							<image src='/static/images/order/location.png' style="width: 30rpx; height: 30rpx;"
								class="mr-10"></image>
							<view class="font-size-extra-lg text-color-base font-weight-bold text-truncate">
								{{ address.street }}
							</view>
						</view>
						<view class="font-size-sm text-color-assist overflow-hidden text-truncate">
							由<text class="text-color-base" style="margin: 0 10rpx">{{ store.name }}</text>配送
						</view>
					</view>
					<view class="right">
						<view class="dinein" :class="{active: orderType == 'takein'}" @tap="SET_ORDER_TYPE('takein')">
							<text>自11取</text>
						</view>
						<view class="takeout" :class="{active: orderType == 'takeout'}" @tap="takout">
							<text>外11卖</text>
						</view>
					</view>
				</view>
				<view class="coupon">
					<text class="title">"霸气mini卡"超级购券活动，赶紧去购买</text>
					<view class="iconfont iconarrow-right"></view>
				</view>
			</view>
			<view class="content">
				<scroll-view class="menus" :scroll-into-view="menuScrollIntoView" scroll-with-animation scroll-y>
					<view class="wrapper">
						<view class="menu" :id="`menu-${item.id}`" :class="{'current': item.id === currentCateId}"
							v-for="(item, index) in goods" :key="index" @tap="handleMenuTap(item.id)">
							<text>{{ item.sort }}</text>
							<view class="dot" v-show="menuCartNum(item.id)">{{ menuCartNum(item.id) }}</view>
						</view>
					</view>
				</scroll-view>
				<!-- goods list begin -->
				<scroll-view class="goods" scroll-with-animation scroll-y :scroll-top="cateScrollTop"
					@scroll="handleGoodsScroll">
					<view class="wrapper">
						<swiper class="ads" id="ads" autoplay :interval="3000" indicator-dots>
							<swiper-item v-for="(item, index) in ads" :key='index'>
								<image :src="item.image"></image>
							</swiper-item>
						</swiper>
						<view class="list">
							<!-- category begin -->
							<view class="category" v-for="(item, index) in goods" :key="index" :id="`cate-${item.id}`">
								<view class="title">
									<text>{{ item.sort }}</text>
									<image :src="item.picture" class="icon"></image>
								</view>
								<view class="items">
									<!-- 商品 begin -->
									<view class="good" v-for="(good, key) in item.list" :key="key">
										<image :src="good.images" class="image" @tap="showGoodDetailModal(item, good)">
										</image>
										<view class="right">
											<text class="name">{{ good.name }}</text>
											<text class="tips">{{ good.intro }}</text>
											<view class="price_and_action">
												<text class="price">￥{{ good.price }}</text>
												<view class="btn-group" v-if="good.productSortAndOptions.length >0">
													<button type="primary" class="btn property_btn" hover-class="none"
														size="mini" @tap="showGoodDetailModal(item, good)">
														选规格
													</button>
													<view class="dot" v-show="goodCartNum(good.id)">
														{{ goodCartNum(good.id) }}
													</view>
												</view>
												<view class="btn-group" v-else>
													<button type="default" v-show="goodCartNum(good.id)" plain
														class="btn reduce_btn" size="mini" hover-class="none"
														@tap="handleReduceFromCart(item, good,false)">
														<view class="iconfont iconsami-select"></view>
													</button>
													<view class="number" v-show="goodCartNum(good.id)">
														{{ goodCartNum(good.id) }}
													</view>
													<button type="primary" class="btn add_btn" size="min"
														hover-class="none" @tap="handleAddToCart(item, good, 1,false)">
														<view class="iconfont iconadd-select"></view>
													</button>
												</view>
											</view>
										</view>
									</view>
									<!-- 商品 end -->
								</view>
							</view>
							<!-- category end -->
						</view>
					</view>
				</scroll-view>
				<!-- goods list end -->
			</view>
			<!-- content end -->
			<!-- 购物车栏 begin -->
			<view class="cart-box" v-if="cart.length > 0">
				<view class="mark">
					<image src="/static/images/menu/cart.png" class="cart-img" @tap="openCartPopup"></image>
					<view class="tag">{{ getCartGoodsNumber }}</view>
				</view>
				<view class="price">￥{{ getCartGoodsPrice }}</view>
				<button type="primary" class="pay-btn" @tap="toPay" :disabled="disabledPay">
					{{ disabledPay ? `差${spread}元起送` : '去结算' }}
				</button>
			</view>
			<!-- 购物车栏 end -->
		</view>
		<!-- 商品详情模态框 begin -->
		<modal :show="goodDetailModalVisible" class="good-detail-modal" color="#5A5B5C" width="90%" custom
			padding="0rpx" radius="12rpx">
			<view class="cover">
				<image v-if="good.picture" :src="good.picture" class="image"></image>
				<view class="btn-group">
					<image src="/static/images/menu/share-good.png"></image>
					<image src="/static/images/menu/close.png" @tap="closeGoodDetailModal"></image>
				</view>
			</view>
			<scroll-view class="detail" scroll-y>
				<view class="wrapper">
					<view class="basic">
						<view class="name">{{ good.name }}</view>
						<view class="tips">{{ good.intro }}</view>
					</view>
					<view class="properties" v-if="good.productSortAndOptions">
						<view class="property" v-for="(item, index) in good.productSortAndOptions" :key="index">
							<view class="title">
								<text class="name">{{ item.productSpecSort.name }}</text>
								<view class="desc" v-if="item.desc">({{ item.desc }})</view>
							</view>
							<view class="values">
								<view class="value" v-for="(value, key) in item.productSpecOptions" :key="key"
									:class="{'default': value.is_default}" @tap="changePropertyDefault(value,item)">
									<div class="item-container">
										<div>{{ value.name }}</div>
										<div v-if="value.price != '0.00'">￥{{value.price}}</div>
									</div>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="action">
				<view class="left">

					<view class="price">￥{{ good.price }}</view>
					<view class="props" v-if="getGoodSelectedProps(good)">
						{{ getGoodSelectedProps(good) }}
					</view>
				</view>
				<view class="btn-group">
					<button type="default" plain class="btn" size="mini" hover-class="none" @tap="handlePropertyReduce">
						<view class="iconfont iconsami-select"></view>
					</button>
					<view class="number">{{ good.quantity }}</view>
					<button type="primary" class="btn" size="min" hover-class="none" @tap="handlePropertyAdd">
						<view class="iconfont iconadd-select"></view>
					</button>
				</view>
			</view>
			<view class="add-to-cart-btn" @tap="handleAddToCartInModal">
				<view>加入购物车</view>
			</view>
		</modal>
		<!-- 商品详情模态框 end -->
		<!-- 购物车详情popup -->
		<popup-layer direction="top" :show-pop="cartPopupVisible" class="cart-popup">
			<template slot="content">
				<view class="top">
					<text @tap="handleCartClear">清空</text>
				</view>
				<scroll-view class="cart-list" scroll-y>
					<view class="wrapper">
						<view class="item" v-for="(item, index) in cart" :key="index">
							<view class="left">
								<view class="name">{{ item.name }}</view>
								<view class="props">{{ item.props_text }}</view>
							</view>
							<view class="center">
								<text>￥{{ item.price }}</text>
							</view>
							<view class="right">
								<button type="default" plain size="mini" class="btn" hover-class="none"
									@tap="handleCartItemReduce(index)">
									<view class="iconfont iconsami-select"></view>
								</button>
								<view class="number">{{ item.quantity }}</view>
								<button type="primary" class="btn" size="min" hover-class="none"
									@tap="handleCartItemAdd(index)">
									<view class="iconfont iconadd-select"></view>
								</button>
							</view>
						</view>
						<!-- <view class="item" v-if="orderType == 'takeout' && store.packing_fee">
							<view class="left">
								<view class="name">包装费</view>
							</view>
							<view class="center">
								<text>￥{{ parseFloat(store.packing_fee) }}</text>
							</view>
							<view class="right invisible">
								<button type="default" plain size="mini" class="btn" hover-class="none">
									<view class="iconfont iconsami-select"></view>
								</button>
								<view class="number">1221</view>
								<button type="primary" class="btn" size="min" hover-class="none">
									<view class="iconfont iconadd-select"></view>
								</button>
							</view>
						</view> -->
					</view>
				</scroll-view>
			</template>
		</popup-layer>
		<!-- 购物车详情popup -->
	</view>
	<view class="loading" v-else>
		<image src="/static/images/loading.gif"></image>
	</view>
</template>

<script>
	import modal from '@/components/modal/modal'
	import popupLayer from '@/components/popup-layer/popup-layer'
	import {
		constants
	} from 'os';
	import {
		mapState,
		mapMutations,
		mapActions,
		mapGetters
	} from 'vuex'
	import {
		login
	} from "../../api/login";
	import {
		getProductList
	} from "../../api/product";
	export default {
		components: {
			modal,
			popupLayer
		},
		data() {
			return {
				goods: [], //所有商品
				ads: [{
						image: 'https://img-shop.qmimg.cn/s23107/2020/04/27/4ebdb582a5185358c4.jpg?imageView2/2/w/600/h/600'
					},
					{
						image: 'https://images.qmai.cn/s23107/2020/05/08/c25de6ef72d2890630.png?imageView2/2/w/600/h/600'
					},
					{
						image: 'https://img-shop.qmimg.cn/s23107/2020/04/10/add546c1b1561f880d.jpg?imageView2/2/w/600/h/600'
					},
					{
						image: 'https://images.qmai.cn/s23107/2020/04/30/b3af19e0de8ed42f61.jpg?imageView2/2/w/600/h/600'
					},
					{
						image: 'https://img-shop.qmimg.cn/s23107/2020/04/17/8aeb78516d63864420.jpg?imageView2/2/w/600/h/600'
					}
				],
				loading: true,
				currentCateId: 6905, //默认分类
				cateScrollTop: 0,
				menuScrollIntoView: '',
				cart: [], //购物车
				goodDetailModalVisible: false, //是否饮品详情模态框
				good: {}, //当前饮品
				category: {}, //当前饮品所在分类
				cartPopupVisible: false,
				sizeCalcState: false,
				type: 'center',
				msgType: 'success',
				messageText: '这是一条成功提示',
				value: ''
			}
		},
		async onShow() {
			if (uni.getStorageSync("openid") != undefined && uni.getStorageSync("openid") != '')
				await this.init()

		},

		async onLoad(options) {
			//二维码携带的参数
			if (options && options.scene) {
				const scene = decodeURIComponent(options.scene);
				const param = scene.split(":")
				this.shopId = param[1]
				this.tableId = param[2]
				uni.setStorageSync('tableId', param[2])
				uni.setStorageSync('shopId', param[1])
				if (uni.getStorageSync("openid") == undefined || uni.getStorageSync("openid") == '')
					await this.alogin()

			}


			/**
			 * 全局中使用同一个 WebSocket 对象，那么无论在哪个页面添加监听事件，该监听事件都能监听到后端发送的 WebSocket 消息
			 */
			this.$socket.getMessage(res => {
				const data = (JSON.parse(res.data))
				if (typeof data === "object") {
					console.log("========同步购物车======")
					data.forEach(res => {
						let foundItem = {}
						this.goods.find(item => {
							// 使用find方法找到包含符合条件的list对象的元素
							const listItem = item.list.find(listItem => listItem.id === res.productId);
							if (listItem !== undefined) {
								foundItem = listItem // 返回list中id=res.productId的这一条数据
								if (res.props_text != undefined) {
									foundItem.props_text = res.props_text
									foundItem.use_property = true
									foundItem.price = res.price
									
								}
							}
						});
						let sort = this.goods.find(m => m.id == foundItem.sortId)

						if (res.type === '+') {
							this.kk(sort, foundItem, 1)
						} else {
							this.ll(sort, foundItem)
						}
					})

				} else if (typeof data === "string") {
					if (data === "本桌订单提交成功") {
						const a = {
							clear: ""
						}
						//通知后端可以提交新的订单了
						this.$socket.send(JSON.stringify(a))
						uni.removeStorageSync('cart')
						this.cart = []
						uni.$emit('refresh', {
							refresh: true
						});
						// uni.navigateBack()
						this.messageToggle("success", data)

						// uni.reLaunch({
						// 	url: '/pages/take-foods/take-foods'
						// })
						uni.reLaunch({
							url: '/pages/menu/menu'
						})

					} else if (data === "已有人提交订单，请稍后") {
						this.messageToggle("warn", data)
					} else if (data === '本桌订单提交失败') {
						uni.$emit('refresh', {
							refresh: true
						});
						// uni.navigateBack()
						this.messageToggle("error", data)
					}
				}
			})

		},
		computed: {
			...mapState(['orderType', 'address', 'store']),
			...mapGetters(['isLogin']),
			goodCartNum() { //计算单个饮品添加到购物车的数量
				return (id) => this.cart.reduce((acc, cur) => {
					if (cur.id === id) {
						return acc += cur.quantity
					}
					return acc
				}, 0)
			},
			menuCartNum() {
				return (id) => this.cart.reduce((acc, cur) => {
					if (cur.cate_id === id) {
						return acc += cur.quantity
					}
					return acc
				}, 0)
			},
			getCartGoodsNumber() { //计算购物车总数
				return this.cart.reduce((acc, cur) => acc + cur.quantity, 0)
			},
			getCartGoodsPrice() { //计算购物车总价
				return this.cart.reduce((acc, cur) => acc + cur.quantity * cur.price, 0)
			},
			// disabledPay() { //是否达到起送价
			// 	return this.orderType == 'takeout' && (this.getCartGoodsPrice < this.store.min_price) ? true : false
			// },
			// spread() { //差多少元起送
			// 	if (this.orderType != 'takeout') return
			// 	return parseFloat((this.store.min_price - this.getCartGoodsPrice).toFixed(2))
			// }
		},
		methods: {
			...mapMutations(['SET_ORDER_TYPE']),
			...mapActions(['getStore']),
			async init() { //页面初始化
				uni.removeStorageSync('cart')
				this.loading = true
				await this.getStore()
				this.goods = await getProductList()
				this.loading = false
				this.cart =  []
				const a = {
					sync: ""
				}
				this.$socket.send(JSON.stringify(a))
			},
			async alogin() {
				wx.login({
					success(res) {
						//带上信息去后端请求登录
						login(res.code).then((res) => {
							uni.setStorageSync("openid", res.openid)
							// uni.setStorageSync("user", res.data)
						})
					},
					fail: (err) => {
						reject(err)
					}
				})
			},
			messageToggle(type, msg) {
				this.msgType = type
				this.messageText = msg
				this.$refs.message.open()
			},

			// takout() {
			// 	if (this.orderType == 'takeout') return

			// 	if (!this.isLogin) {
			// 		uni.navigateTo({
			// 			url: '/pages/login/login'
			// 		})
			// 		return
			// 	}

			// 	uni.navigateTo({
			// 		url: '/pages/address/address?is_choose=true'
			// 	})
			// },
			handleMenuTap(id) { //点击菜单项事件
				if (!this.sizeCalcState) {
					this.calcSize()
				}

				this.currentCateId = id
				this.$nextTick(() => this.cateScrollTop = this.goods.find(item => item.id == id).top)
			},
			handleGoodsScroll({
				detail
			}) { //商品列表滚动事件
				if (!this.sizeCalcState) {
					this.calcSize()
				}
				const {
					scrollTop
				} = detail
				let tabs = this.goods.filter(item => item.top <= scrollTop).reverse()
				if (tabs.length > 0) {
					this.currentCateId = tabs[0].id
				}
			},
			calcSize() {
				let h = 10

				let view = uni.createSelectorQuery().select('#ads')
				view.fields({
					size: true
				}, data => {
					h += Math.floor(data.height)
				}).exec()

				this.goods.forEach(item => {
					let view = uni.createSelectorQuery().select(`#cate-${item.id}`)
					view.fields({
						size: true
					}, data => {
						item.top = h
						h += data.height
						item.bottom = h
					}).exec()
				})
				this.sizeCalcState = true
			},
			handleAddToCart(cate, good, num, flag) { //添加到购物车
				if (!flag) {
					const a = {
						change: "",
						productId: good.id,
						type: "+",
						props_text: good.props_text,
						price:good.price
					}
					this.$socket.send(JSON.stringify(a))
				}
				this.kk(cate, good, num)
			},
			kk(cate, good, num) {
				const index = this.cart.findIndex(item => {
					if (good.use_property) {
						return (item.id === good.id) && (item.props_text === good.props_text)
					} else {
						return item.id === good.id
					}
				})
				console.log(good, "99999999999")
				//有相同的商品
				if (index > -1) {
					this.cart[index].quantity += num
					this.cart[index].use_property = true
				} else {
					this.cart.push({
						id: good.id,
						cate_id: cate.id,
						name: good.name,
						price: good.price,
						quantity: num,
						image: good.images,
						use_property: good.use_property,
						props_text: good.props_text,
						// props: good.props
					})
				}

			},
			//减
			handleReduceFromCart(item, good, flag) {
				if (!flag) {
					const a = {
						change: "",
						productId: good.id,
						type: "-"
					}
					this.$socket.send(JSON.stringify(a))
				}
				this.ll(item, good)

			},
			ll(item, good) {
				const index = this.cart.findIndex(item => item.id === good.id)
				this.cart[index].quantity -= 1
				if (this.cart[index].quantity <= 0) {
					this.cart.splice(index, 1)
				}
			},
			showGoodDetailModal(item, good) {
				this.good = JSON.parse(JSON.stringify({
					...good,
					quantity: 1,
					props_text: ''

				}))
				this.category = JSON.parse(JSON.stringify(item))
				this.goodDetailModalVisible = true
			},
			closeGoodDetailModal() { //关闭饮品详情模态框
				this.goodDetailModalVisible = false
				this.category = {}
				this.good = {}
			},
			changePropertyDefault(item, list) { //改变默认属性值
				if (item.price != '0.00')
					this.good.price = item.price
				list.productSpecOptions = list.productSpecOptions.map(m => {
					if (m === item) {
						return {
							...m,
							is_default: 1
						};
					} else {
						return {
							...m,
							is_default: 0
						};
					}
				});
				list.props_text = item.name
				this.good.quantity = 1
			},
			getGoodSelectedProps(good, type = 'text') { //计算当前饮品所选属性
				if (good.id != undefined) {
					let a;
					good.productSortAndOptions.forEach(m => {
						a = a + m.props_text + ','
					})

					if ((a == ',,' || a == ',' || a.includes("NaN") || a.includes("undifined")))
						return ''
					else {
						return (a.replace(/NaN|undefined/g, '')).slice(0, -1);
					}
				}

			},
			handlePropertyAdd() {
				this.good.quantity += 1
			},
			handlePropertyReduce() {
				if (this.good.quantity === 1) return
				this.good.quantity -= 1
			},
			handleAddToCartInModal() {
				const product = Object.assign({}, this.good, {
					props_text: this.getGoodSelectedProps(this.good),
					// props: this.getGoodSelectedProps(this.good, 'id'),
					use_property: true
				})
				this.handleAddToCart(this.category, product, this.good.quantity)
				this.closeGoodDetailModal()
			},
			openCartPopup() { //打开/关闭购物车列表popup
				this.cartPopupVisible = !this.cartPopupVisible
			},
			handleCartClear() { //清空购物车
				uni.showModal({
					title: '提示',
					content: '确定清空购物车么',
					success: ({
						confirm
					}) => {
						if (confirm) {
							this.cartPopupVisible = false
							this.cart = []
							let a = {
								clear: ""
							}
							//通知后端可以提交新的订单了
							this.$socket.send(JSON.stringify(a))
							a = {
								sync: ""
							}
							this.$socket.send(JSON.stringify(a))
						}
					}
				})
			},
			handleCartItemAdd(index) {
				const a = {
					change: "",
					productId: this.cart[index].id,
					type: "+"
				}
				this.$socket.send(JSON.stringify(a))
				this.cart[index].quantity += 1
			},
			handleCartItemReduce(index) {
				const a = {
					change: "",
					productId: this.cart[index].id,
					type: "-"
				}
				this.$socket.send(JSON.stringify(a))
				if (this.cart[index].quantity === 1) {
					this.cart.splice(index, 1)
				} else {
					this.cart[index].quantity -= 1
				}
				if (!this.cart.length) {
					this.cartPopupVisible = false
				}

			},
			toPay() {
				// if(!this.isLogin) {
				// 	uni.navigateTo({url: '/pages/login/login'})
				// 	return
				// }

				uni.showLoading({
					title: '加载中'
				})
				uni.setStorageSync('cart', JSON.parse(JSON.stringify(this.cart)))

				uni.navigateTo({
					url: '/pages/pay/pay'
				})
				uni.hideLoading()
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import '~@/pages/menu/menu.scss';

	.item-container {
		display: flex;
		/* 使用flexbox布局 */
		align-items: center;
		/* 上下居中对齐 */
	}

	/* 可以加上一些样式来控制间距等 */
	.item-container div {
		margin-right: 10px;
		/* 给元素之间添加水平间距 */
	}
</style>