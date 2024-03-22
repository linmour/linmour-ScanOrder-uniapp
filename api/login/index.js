import {
	request
} from "../../utils/request";

export const login = (code) => request({
	url: '/system/customer/login',
	method: 'post',
	data: {
		code
	}
})