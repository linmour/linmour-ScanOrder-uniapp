import Vue from 'vue'
import App from './App'
import api from './api'
import util from './common/util'
import store from './store'
import websocketUtil from './utils/websocketUtil'
Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.$store = store
Vue.prototype.$api = api
Vue.prototype.$util = util

// 开启websocket
let websocket = new websocketUtil
Vue.prototype.$socket = websocket

const app = new Vue({
	store,
    ...App
})
app.$mount()	