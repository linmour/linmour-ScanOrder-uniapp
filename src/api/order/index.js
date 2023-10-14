import {request} from "../../utils/request";

export const createOrder = (param) => request({url: '/order/order/createOrder' ,method: 'post',
    data:param
})

export const submitOrder = (orderNo,payType) => request({url: '/order/order/submitOrder'  ,method: 'post',
    data: {orderNo,payType}
})
