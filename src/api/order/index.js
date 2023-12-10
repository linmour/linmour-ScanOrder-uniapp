import {request} from "../../utils/request";

export const createOrder = (param) => request({url: '/order/order/createOrder' ,method: 'post',
    data:param
})

export const checkout = (tableId,payType,openid) => request({url: '/order/order/checkout'  ,method: 'post',
    data: {tableId,payType,openid}
})
