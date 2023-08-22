export const baseURL = 'http://127.0.0.1:12800'

export const request = (options) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: baseURL + options.url, //接口地址：前缀+方法中传入的地址
            method: options.method || 'GET', //请求方法：传入的方法或者默认是“GET”
            data: options.data || {}, //传递参数：传入的参数或者默认传递空集合
            header: {
                'Token': "1"
            },
            success: (res) => {
                console.log('/////')
                if(res.data !== undefined){
                    let startIndex = res.data.lastIndexOf("{", res.data.lastIndexOf("}") - 1);
                    let trimmedResponse = res.data.slice(0, startIndex + 1);
                    let data  = JSON.parse(trimmedResponse.substring(0, trimmedResponse.length - 1))

                    //返回的数据（不固定，看后端接口，这里是   做了一个判断，如果不为true，用uni.showToast方法提示获取数据失败)
                    if (data.code === 200) {
                        resolve(data.data)
                    } else {
                        // if(res.data.code== 401){
                        //     uni.navigateTo({
                        //         url:'/login/login'
                        //     })
                        //     uni.clearStorageSync()
                        // }
                        // reject(res.data.msg)
                    }
                    // 如果不满足上述判断就输出数据
                }


            },
            // 这里的接口请求，如果出现问题就输出接口请求失败
            fail: (err) => {
                console.log(err)
                reject(err)
            }
        })
    })
}
