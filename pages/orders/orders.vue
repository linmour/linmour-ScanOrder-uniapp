<template>
	<view class="container">
		<view v-if="orders.length == 0"
			class="d-flex w-100 h-100 flex-column just-content-center align-items-center">
			<image src="/static/images/loading.gif" class="drinks-img"></image>
			<view class="tips d-flex flex-column align-items-center font-size-base text-color-assist">
				<view>没有历史订单~</view>
			</view>
		</view>
		<view v-else class="orders-list d-flex flex-column w-100" style="padding: 20rpx; padding-bottom: 0;">
			<view class="order-item" v-for="(item, index) in orders" :key="index" style="margin-bottom: 30rpx;"
				@tap="detail(item.orderInfo.id)">
				<list-cell :hover="false">
					<view class="w-100 d-flex align-items-center">
						<view class="flex-fill d-flex flex-column">
							<view class="font-size-lg text-color-base" style="margin-bottom: 13rpx;">
								订单时间：{{ item.orderInfo.createTime }}
							</view>
							<view class="font-size-sm text-color-assist">订单编号：{{ item.orderInfo.id }}</view>
						</view>
						<view class="font-size-lg text-color-primary">
							￥{{ item.orderInfo.payAmount }}
						</view>
					</view>
				</list-cell>
				
			</view>
		</view>
	</view>
</template>

<script>
	import listCell from '@/components/list-cell/list-cell'
	import {
		GetHistoryOrderList
	} from '../../api/order'
	export default {
		components: {
			listCell
		},
		data() {
			return {
				page: 1,
				pageSize: 5,
				orders: []
			}
		},
		computed: {
			// orderGoodsName() {
			// 	return (goods) => {
			// 		let arr = []
			// 		goods.forEach(good => arr.push(good.name + '*' + good.number))
			// 		return arr.join('，')
			// 	}
			// }
		},
		async onLoad() {
			await this.getOrders(false)
		},
		async onShow(){
			await this.getOrders(false)
		},
		async onReachBottom() {
			await this.getOrders(false)
		},
		async onPullDownRefresh() {
			await this.getOrders(true)
		},
		methods: {
			async getOrders(isRefresh = false) {
				uni.showLoading({
					title: '加载中'
				})
				GetHistoryOrderList(uni.getStorageSync('tableId')).then(res => {
					this.orders = res
					console.log(this.orders)
				})

				uni.hideLoading()
			},
			detail(orderId	) {
				uni.navigateTo({
					url: '/pages/orders/detail?orderId=' + orderId
				})
			},
		}
	}
</script>

<style lang="scss" scoped>

</style>