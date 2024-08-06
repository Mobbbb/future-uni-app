import App from './App'
import store from './store'
import {createSSRApp} from 'vue'
import Vuex from "vuex"

export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	return {
		app,
	}
}
