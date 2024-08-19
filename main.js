import App from './App'
import store from './store'
import { createSSRApp } from 'vue'
import Vuex from 'vuex'
import UxTable from './components/ux-table.vue'
import UxSwitch from './components/ux-switch.vue'
import UxCalendar from './components/ux-calendar/calendar.vue'

export function createApp() {
	const app = createSSRApp(App)

	app.use(store)

	app.component('ux-table', UxTable)
	app.component('ux-switch', UxSwitch)
	app.component('ux-calendar', UxCalendar)
	
	return {
		app,
	}
}
