import {
    request
} from '../../utils/request'


export const getProductSort = () => request({url: '/product/sort/getProductSort' ,method: 'get'})
export const getProductList = (sortId) => {
    let url = '/product/product/getProductList';

    if (sortId !== null) {
        url += '?sortId=' + sortId;
    }

    return request({ url, method: 'get' });
};
