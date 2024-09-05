import App from './App'
import store from './store'
import { createSSRApp } from 'vue'
import Vuex from 'vuex'
import UxTable from './components/ux-table.vue'
import UxSwitch from './components/ux-switch.vue'
import UxCalendar from './components/ux-calendar/calendar.vue'
import UxLeft from './components/ux-left.vue'
import UxRight from './components/ux-right.vue'
import UxMonthPicker from './components/ux-month-picker/index.vue'
import UxYearPicker from './components/ux-year-picker/index.vue'
import UxIcon from './components/ux-icon.vue'
import UxDialog from './components/ux-dialog.vue'
import UxNav from './components/ux-nav.vue'
import { onShareAppMessage } from '@dcloudio/uni-app'
import shareMixin from '@/mixins/share.js'

import '@/styles/global.scss'

export function createApp() {
	const app = createSSRApp(App)

	app.use(store)
	app.mixin(shareMixin)

	app.component('ux-table', UxTable)
	app.component('ux-switch', UxSwitch)
	app.component('ux-calendar', UxCalendar)
	app.component('ux-left', UxLeft)
	app.component('ux-right', UxRight)
	app.component('ux-month-picker', UxMonthPicker)
	app.component('ux-year-picker', UxYearPicker)
	app.component('ux-icon', UxIcon)
	app.component('ux-dialog', UxDialog)
	app.component('ux-nav', UxNav)
	
	return {
		app,
	}
}
