import {
    request
} from '../../utils/request'


export const getProductSort = (shopId) => request({url: '/product/sort/getProductSort/'+ shopId ,method: 'get'})
export const getProductList = (shopId, sortId) => {
    let url = '/product/product/getProductList?shopId=' + shopId;

    if (sortId !== null) {
        url += '&sortId=' + sortId;
    }

    return request({ url, method: 'get' });
};
