<!--交易 -> 下单页-->
<template>
	<ux-nav>登录</ux-nav>
	<view class="login-wrap">
		<uni-card padding="24px 10px" v-if="registerStatus">
			<view class="input-item-wrap">
				<text>账号：</text>
				<uni-easyinput v-model="registerUsername" placeholder="请输入账号"></uni-easyinput>
			</view>
			<view class="input-item-wrap">
				<text>密码：</text>
				<uni-easyinput v-model="registerPassword" type="password" placeholder="请输入密码"></uni-easyinput>
			</view>
			<view class="input-item-wrap">
				<text>密码：</text>
				<uni-easyinput v-model="twicePassword" type="password" placeholder="请再次输入密码"></uni-easyinput>
			</view>
			<view class="login-tips-wrap">* 账号密码由数字或字母组成，长度至少6位</view>
			<view class="login-btn-wrap">
				<gc-button type="active" @on-click="clickRegister" width="100%">注册</gc-button>
				<view style="width: 100%;margin-top: 12px;">
					<gc-button @click="registerStatus = false" width="100%">返回</gc-button>
				</view>
			</view>
		</uni-card>
		<uni-card padding="24px 10px" v-else>
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
				<view class="register-btn" @click="registerStatus = true">没有账号？马上注册一个！</view>
			</view>
		</uni-card>
	</view>
</template>


<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { fetchUserLogin, fetchUserRegister } from '@/request.api/index.js'
import { getCookieFromStr } from '@/utils/umob.js'
import GcButton from '@/components/gc-button.vue'

const store = new useStore()

const username = ref('')
const password = ref('')
const registerUsername = ref('')
const registerPassword = ref('')
const twicePassword = ref('')
const registerStatus = ref(false)
const accountRegex = /^[a-zA-Z0-9]+$/

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

const clickRegister = async () => {
	if (!registerUsername.value || !registerPassword.value || !twicePassword.value) {
		ElMessage.error('请填写账号密码')
	} else if (registerUsername.value.length < 6) {
		ElMessage.error('账号长度不足')
	} else if (registerPassword.value.length < 6) {
		ElMessage.error('密码长度不足')
	} else if (!accountRegex.test(registerUsername.value) || !accountRegex.test(registerPassword.value)) {
		ElMessage.error('格式不符合要求')
	} else if (registerPassword.value !== twicePassword.value) {
		ElMessage.error('密码输入不一致')
	} else {
		const result = await fetchUserRegister(registerUsername.value, registerPassword.value)
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
    color: #222;
    font-size: 12px;
}
text {
	flex-shrink: 0;
	color: #222;
}
.register-btn {
	color: #628dd1;
	font-size: 12px;
	text-align: right;
	margin: 12px 0 0 0;
}
.login-tips-wrap {
	margin-bottom: 12px;
	margin-top: -12px;
	color: #bbb;
	font-size: 12px;
}
</style>
