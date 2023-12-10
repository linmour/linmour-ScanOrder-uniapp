import {request} from "../../utils/request";

export const login = (code,nickName,avatarUrl) => request({url: '/system/customer/login' ,method: 'post',
    data: {code,nickName,avatarUrl}
})
