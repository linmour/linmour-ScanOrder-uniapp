import {
	request
} from "../../utils/request";

export const createOrder = (param) => request({
	url: '/order/order/createOrder',
	method: 'post',
	data: param
})

export const checkout = (tableId, payType, openid) => request({
	url: '/order/order/checkout',
	method: 'post',
	data: {
		tableId,
		payType,
		openid
	}
})


export const GetHistoryOrderList = (tableId) => request({
	url: '/order/order/GetHistoryOrderList/' + tableId,
	method: 'get'
})

export const GetCurrentOrderInfo = (tableId) => request({
	url: '/order/order/GetCurrentOrderInfo/' + tableId,
	method: 'get'
})
export const GetOrderInfoDetail = (orderId) => request({
	url: '/order/order/GetOrderInfoDetail/' + orderId,
	method: 'get'
})