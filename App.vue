<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useStore } from 'vuex'

const store = new useStore()

const INIT_USER = () => store.dispatch('app/INIT_USER')
const setScreenInfo = (value) => store.commit('app/setScreenInfo', value)
const getFutureConfigInfo = () => store.dispatch('order/getFutureConfigInfo')

onLaunch(() => {
	INIT_USER()
	getFutureConfigInfo()
	uni.getSystemInfo({
		success: function (res) {
			setScreenInfo({
				width: res.windowWidth,
				height: res.windowHeight,
			})
		}
	})
})

onShow(() => {

})

onHide(() => {

})
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	// 设置整个项目的背景色
	page {

	}
</style>
