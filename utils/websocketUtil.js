class websocketUtil {
	constructor(url, time) {
		if (url !== null) {
			let a = uni.getStorageSync('shopId')
			let b = uni.getStorageSync('tableId')
			console.log(a,b,"========================================================================")
			this.is_open_socket = false //避免重复连接
			this.url = "ws://127.0.0.1:12800/websocket/shop/"+ a  +"/table/" + b  //地址
			this.data = null
			//心跳检测
			this.timeout = time //多少秒执行检测
			this.heartbeatInterval = null //检测服务器端是否还活着
			this.reconnectTimeOut = null //重连之后多久再次重连

			try {
				return this.connectSocketInit()
			} catch (e) {
				console.log('catch');
				this.is_open_socket = false
				this.reconnect();
			}
		}

	}

	// 进入这个页面的时候创建websocket连接【整个页面随时使用】			
	connectSocketInit() {
		this.socketTask = uni.connectSocket({
			url: this.url,
			header: {
				'Token': "1",
			},
			success: () => {	
				console.log("正准备建立websocket中...");
				// 返回实例
				return this.socketTask
			},
		});
		this.socketTask.onOpen((res) => {

			console.log("WebSocket连接正常！");
			clearTimeout(this.reconnectTimeOut)
			clearTimeout(this.heartbeatInterval)
			this.is_open_socket = true;
			this.start();
			// 注：只有连接正常打开中 ，才能正常收到消息
			// this.socketTask.onMessage((res) => {
			//     console.log(res.data)
			// });
		})
		// 监听连接失败，这里代码我注释掉的原因是因为如果服务器关闭后，和下面的onclose方法一起发起重连操作，这样会导致重复连接
		// uni.onSocketError((res) => {
		// 	console.log('WebSocket连接打开失败，请检查！');
		// 	this.is_open_socket = false;
		// 	this.reconnect();
		// });
		// 这里仅是事件监听【如果socket关闭了会执行】
		this.socketTask.onClose(() => {
			console.log("已经被关闭了")
			this.is_open_socket = false;
			this.reconnect();
		})
	}

	//发送消息
	send(value) {
		if (!this.is_open_socket) {
			// 等待连接成功后再发送消息
			const interval = setInterval(() => {
				if (this.is_open_socket) {
					clearInterval(interval);
					this.socketTask.send({
						data: value,
						async success() {
							console.log("消息发送成功");
						},
					});
				}
			}, 1000); // 每1秒检查一次是否连接成功
		} else {
			this.socketTask.send({
				data: value,
				async success() {
					console.log("消息发送成功");
				},
			});
		}
	}

	//开启心跳检测
	start() {
		this.heartbeatInterval = setTimeout(() => {
			this.data = {
				"test": "1"
			}
			this.send(JSON.stringify(this.data));
			console.log("测试连接")
		}, this.timeout)
	}

	//重新连接
	reconnect() {
		//停止发送心跳
		clearInterval(this.heartbeatInterval)
		//如果不是人为关闭的话，进行重连
		if (!this.is_open_socket) {
			this.reconnectTimeOut = setTimeout(() => {
				this.connectSocketInit();
			}, 3000)
		}
	}

	//外部获取消息
	getMessage(callback) {
		this.socketTask.onMessage((res) => {
			return callback(res)
		})
	}


}

export default websocketUtil