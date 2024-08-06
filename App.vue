<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useStore } from 'vuex'

const store = new useStore()

const INIT_USER = (value) => store.dispatch('app/INIT_USER', value)
const getFutureConfigInfo = () => store.dispatch('order/getFutureConfigInfo')

onLaunch(() => {
	INIT_USER()
	getFutureConfigInfo()
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
