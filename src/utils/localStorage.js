// 定义一个本地存储模块localStorage.js
const localStorage = {
    // 存储数据到本地缓存
    set(key, value) {
        uni.setStorageSync(key, value)
    },
    // 从本地缓存中读取数据
    get(key) {
        return uni.getStorageSync(key)
    },
    // 更新本地缓存中的数据
    update(key, value) {
        // 获取原有的数据
        let oldValue = this.get(key)
        if (oldValue !== null && typeof oldValue === 'object') {
            // 如果原有数据为对象，则使用Object.assign()方法进行合并
            value = Object.assign({}, oldValue, value)
        }
        this.set(key, value)
    },
    // 从本地缓存中删除数据
    remove(key) {
        uni.removeStorageSync(key)
    }
}

export default localStorage
