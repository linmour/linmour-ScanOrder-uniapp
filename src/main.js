import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import websocketUtil from './utils/websocketUtil'
//开启websocket
export function createApp() {
	const app = createSSRApp(App);
	let websocket = new websocketUtil(null,1000)
	app.config.globalProperties.$socket = websocket;

	return {
		app,
	};
}

