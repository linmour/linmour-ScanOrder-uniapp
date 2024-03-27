<template>
	<view class="container" v-if="!loading">
		<view v-if="orderInfo.orderInfo  == null "
			class="d-flex w-100 h-100 flex-column just-content-center align-items-center">
			<image src="/static/images/loading.gif" class="drinks-img"></image>
			<view class="tips d-flex flex-column align-items-center font-size-base text-color-assist">
				<view>您还没有点单</view>
				<view>快去犒劳一下自己吧~</view>
			</view>
			<button type="primary" class="drink-btn" size="default" @tap="menu">去点餐</button>
			<view class="font-size-sm text-color-primary" @tap="orders">查看历史订单</view>
		</view>
		<template v-else>
			<view class="order-box" v-if="f">

				<view class="bg-white">
					<view class="section">
						<list-cell :hover="false" padding="50rpx 30rpx">
							<view class="w-100 d-flex flex-column">
								<!-- goods begin -->
								<view class="w-100 d-flex flex-column position-relative mt-30"
									style="margin-bottom: -40rpx;">
									<view class="w-100 d-flex align-items-center mb-40"
										v-for="(good, index) in orderInfo.orderItems" :key="index">
										<view class="d-flex flex-column w-60 overflow-hidden">
											<view class="font-size-lg text-color-base mb-10 text-truncate">
												{{ good.name }}
											</view>
											<view class="font-size-sm text-color-assist text-truncate">
												{{ good.propsText }}
											</view>
										</view>
										<view class="d-flex w-40 align-items-center justify-content-between pl-30">
											<view class="font-size-base text-color-base">x{{ good.quantity }}</view>
											<view class="font-size-base text-color-base font-weight-bold">
												￥{{ good.price }}</view>
										</view>
									</view>
								</view>
								<!-- goods end -->
							</view>
						</list-cell>
					</view>
					<view class="section">
						<!-- order info begin -->
						<list-cell :hover="false" padding="50rpx 30rpx">
							<view class="w-100 d-flex flex-column">
								<view class="pay-cell">
									<view>订单号</view>
									<view class="font-weight-bold">{{ orderInfo.orderInfo.id }}</view>
								</view>
								<view class="pay-cell">
									<view>金额</view>
									<view class="font-weight-bold">￥{{orderInfo.orderInfo.payAmount}}</view>
								</view>
								<view class="pay-cell">
									<view>下单时间</view>
									<view class="font-weight-bold">{{ orderInfo.orderInfo.createTime}}</view>
								</view>

								<button @click="checkout">完成订单</button>
							</view>
						</list-cell>
						<!-- order info end -->
					</view>
				</view>
			</view>

			<!-- 历史订单 -->
			<!-- <view class="orders-list d-flex flex-column w-100" style="padding: 20rpx; padding-bottom: 0;">
				<view class="order-item" v-for="(item, index) in cart" :key="index" style="margin-bottom: 30rpx;"
					@tap="detail(item.order.id)">
					<list-cell :hover="false">
						<view class="w-100 d-flex align-items-center">
							<view class="flex-fill d-flex flex-column">
								<view class="font-size-lg text-color-base" style="margin-bottom: 20rpx;">
									用餐日期：{{ item.order.createTime }}
								</view>
								<view class="font-size-sm text-color-assist">订单编号：{{ item.order.id }}</view>
							</view>
							<view class="font-size-lg text-color-primary">
								￥{{ item.order.payAmount }}
							</view>
						</view>
					</list-cell>
				</view> -->
			<!-- </view> -->
		</template>
	</view>
	<view class="loading" v-else>
		<image src="/static/images/loading.gif"></image>
	</view>
</template>

<script>
	import listCell from '@/components/list-cell/list-cell'
	import {
		mapState
	} from 'vuex'
	import {
		GetCurrentOrderInfo,
		checkout,
	} from '../../api/order'

	export default {
		components: {
			listCell
		},
		data() {
			return {
				loading: true,
				orderInfo: {},
				f: true
			}
		},
		computed: {
			...mapState(['order']),
		},
		onShow() {
			this.init()
		},
		methods: {
			detail(orderId) {
				uni.navigateTo({
					url: '/pages/orders/detail?orderId=' + orderId
				})
			},
			init() {
				this.orderInfo = {}	
				this.loading = true
				GetCurrentOrderInfo(uni.getStorageSync("tableId")).then(res => {
					this.orderInfo = res
					console.log(this.orderInfo)	
					this.loading = false
				})

			},
			checkout() {
				checkout(uni.getStorageSync("tableId"), 4, uni.getStorageSync("openid")).then(r => {
					this.f = false
					this.init()
				})
			},
			orders() {
				uni.switchTab({
					url: '/pages/orders/orders'
				})
			},
			menu() {
				uni.switchTab({
					url: '/pages/menu/menu'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* #ifdef H5 */
	page {
		min-height: 100%;
		background-color: $bg-color;
	}

	/* #endif */
	.order-box {
		padding: 20rpx;
		/* #ifdef H5 */
		margin-bottom: 100rpx;
		/* #endif */
	}

	.drinks-img {
		width: 260rpx;
		height: 260rpx;
	}

	.tips {
		margin: 60rpx 0 80rpx;
		line-height: 48rpx;
	}

	.drink-btn {
		width: 320rpx;
		border-radius: 50rem !important;
		margin-bottom: 40rpx;
		font-size: $font-size-base;
		line-height: 3.0;
	}

	@mixin arch {
		content: "";
		position: absolute;
		background-color: $bg-color;
		width: 30rpx;
		height: 30rpx;
		bottom: -15rpx;
		z-index: 10;
		border-radius: 100%;
	}

	.section {
		position: relative;

		&::before {
			@include arch;
			left: -15rpx;
		}

		&::after {
			@include arch;
			right: -15rpx;
		}
	}

	.pay-cell {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: $font-size-base;
		color: $text-color-base;
		margin-bottom: 40rpx;

		&:nth-last-child(1) {
			margin-bottom: 0;
		}
	}

	.sort-num {
		font-size: 64rpx;
		font-weight: bold;
		color: $text-color-base;
		line-height: 2;
	}

	.steps__img-column {
		display: flex;
		margin: 30rpx 0;

		.steps__img-column-item {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 80rpx;
				height: 80rpx;
			}
		}
	}

	.steps__text-column {
		display: flex;
		margin-bottom: 40rpx;

		.steps__text-column-item {
			flex: 1;
			display: inline-flex;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: $font-size-base;
			color: $text-color-assist;

			&.active {
				color: $text-color-base;
				font-weight: bold;

				.steps__column-item-line {
					background-color: $text-color-base;
				}
			}

			.steps__column-item-line {
				flex: 1;
				height: 2rpx;
				background-color: #919293;
				transform: scaleY(0.5);
			}

			.steps__text-column-item-text {
				margin: 0 8px;
			}
		}
	}
</style>