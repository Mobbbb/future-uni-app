<!--交易 -> 下单页-->
<template>
	<view class="login-wrap">
		<uni-card padding="24px 10px">
			<view class="input-item-wrap">
				<text>账号：</text>
				<uni-easyinput v-model="username" placeholder="请输入账号"></uni-easyinput>
			</view>
			<view class="input-item-wrap">
				<text>密码：</text>
				<uni-easyinput v-model="password" type="password" placeholder="请输入密码"></uni-easyinput>
			</view>
			<view class="login-btn-wrap">
				<gc-button type="active" @on-click="clickLogin" width="100%">登录</gc-button>
			</view>
		</uni-card>
	</view>
</template>


<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { fetchUserLogin } from '@/request.api/index.js'
import { getCookieFromStr } from '@/utils/umob.js'
import GcButton from '@/components/gc-button.vue'

const store = new useStore()

const username = ref('')
const password = ref('')

const saveLoginStatus = (value) => store.dispatch('app/saveLoginStatus', value)
const INIT_USER = (value) => store.dispatch('app/INIT_USER', value)
const isLogin = computed(() => store.getters['app/isLogin'])

const clickLogin = async () => {
	if (!username.value || !password.value) {
		ElMessage.error('请填写账号密码')
	} else {
		const result = await fetchUserLogin(username.value, password.value)
		afterLoginSubmit(result)
	}
}

const afterLoginSubmit = async (result) => {
	const { data = {}, success, msg } = result

	// #ifdef MP-WEIXIN
	const cookies = result.cookies
	// #endif
	// #ifndef MP-WEIXIN
	const cookies = [''] // 非wx不需要cookie，模拟空cookie
	// #endif

	if (success && cookies.length) {
		ElMessage.success(msg)
		data.cookies = cookies
		saveLoginStatus(data)
		await INIT_USER()
		setTimeout(() => {
			uni.switchTab({
				url: '/pages/mine/index',
			})
		}, 1000)
	} else {
		ElMessage.error(msg)
	}
}

onMounted(() => {
	if (isLogin.value) {
		uni.switchTab({
			url: '/pages/mine/index',
		})
	}
})
</script>

<style scoped>
.login-wrap {
	padding-top: 12px;
}
.input-item-wrap {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
}
.login-tips-wrap {
    margin-bottom: 12px;
    color: #bbb;
    font-size: 12px;
}
text {
	flex-shrink: 0;
}
</style>
