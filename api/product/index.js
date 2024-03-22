import {
    request
} from '../../utils/request'


// export const getProductSort = () => request({url: '/product/sort/getProductSort' ,method: 'get'})
export const getProductList = () => {
    return request({ url:'/product/product/getProductList', method: 'get' });
};
