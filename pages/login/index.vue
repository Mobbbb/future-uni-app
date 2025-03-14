<!--交易 -> 下单页-->
<template>
	<ux-nav>登录</ux-nav>
	<view class="login-wrap">
		<uni-card padding="24px 10px" v-if="showRegister">
			<view class="input-item-wrap">
				<text>账 号：</text>
				<uni-easyinput v-model="registerUsername" placeholder="请输入账号"></uni-easyinput>
			</view>
			<input type="text" class="display-input">
			<input type="password" value="1" class="display-input">
			<view class="input-item-wrap">
				<text>密 码：</text>
				<uni-easyinput v-model="registerPassword" type="password" placeholder="请输入密码"></uni-easyinput>
			</view>
			<view class="input-item-wrap">
				<text>密 码：</text>
				<uni-easyinput v-model="twicePassword" type="password" placeholder="请再次输入密码"></uni-easyinput>
			</view>
			<view class="login-tips-wrap">* 账号密码由数字或字母组成，长度至少6位</view>
			<view class="login-btn-wrap">
				<gc-button type="active" @on-click="clickRegister" width="100%">注册</gc-button>
				<view style="width: 100%;margin-top: 16px;">
					<gc-button @on-click="showRegister = false" width="100%">返回</gc-button>
				</view>
			</view>
		</uni-card>
		<uni-card padding="24px 10px" v-else>
			<view class="input-item-wrap">
				<text>账 号：</text>
				<uni-easyinput v-model="username" placeholder="请输入账号"></uni-easyinput>
			</view>
			<view class="input-item-wrap">
				<text>密 码：</text>
				<uni-easyinput v-model="password" type="password" placeholder="请输入密码"></uni-easyinput>
			</view>
			<view class="input-item-wrap">
				<text>验证码：</text>
				<uni-easyinput v-model="captcha" placeholder="请输入验证码"></uni-easyinput>
				<img v-if="registerCaptchaImage" :src="registerCaptchaImage" @click="getCaptcha" class="register-captcha">
				<view v-else class="register-captcha"></view>
			</view>
			<view class="login-btn-wrap">
				<gc-button type="active" @on-click="clickLogin" width="100%">登录</gc-button>
				<!--  #ifdef MP-WEIXIN -->
				<view style="width: 100%;margin-top: 16px;" v-if="hasRegistered === true">
					<gc-button type="wx" @on-click="quickLogin" width="100%">
						<uni-icons type="weixin" color="white" size="24" style="margin-right: 6px;"></uni-icons>
						一键登录
					</gc-button>
				</view>
				<view class="register-btn-wrap" v-if="hasRegistered === false">
					<text class="register-btn" @click="showRegister = true">没有账号？马上注册一个！</text>
				</view>
				<!-- #endif -->
			</view>
		</uni-card>
	</view>
</template>


<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { fetchUserLogin, fetchUserRegister, fetchCaptcha, fetchLoginByCode, fetchCheckOpenId } from '@/request.api/index.js'
import { getCookieFromStr } from '@/utils/umob.js'
import { base64Encode, addWxCookie, getLoginCode } from '@/utils'
import { baseUrl, prefixApi } from '@/request.api/index.js'
import GcButton from '@/components/gc-button.vue'

const store = new useStore()

const username = ref('')
const password = ref('')
const registerUsername = ref('')
const registerPassword = ref('')
const twicePassword = ref('')
const captcha = ref('')
const showRegister = ref(false)
const hasRegistered = ref(null)
const registerCaptchaImage = ref('')
const accountRegex = /^[a-zA-Z0-9]+$/

const saveLoginStatus = (value) => store.dispatch('app/saveLoginStatus', value)
const INIT_USER = () => store.dispatch('app/INIT_USER')
const isLogin = computed(() => store.getters['app/isLogin'])

const checkOpenId = async () => {
	const { code, provider } = await getLoginCode()
	const result = await fetchCheckOpenId(code, provider)
	const data = result.data || {}
	hasRegistered.value = data.status
}

const quickLogin = async () => {
	const { code, provider } = await getLoginCode()
	const result = await fetchLoginByCode(code, provider)
	afterLoginSubmit(result)
}

const clickLogin = async () => {
	if (!username.value || !password.value) {
		ElMessage.error('请填写账号密码')
	} else if (!captcha.value) {
		ElMessage.error('请输入验证码')
	} else {
		const result = await fetchUserLogin(username.value, password.value, captcha.value)
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
		const { code, provider } = await getLoginCode()
		const result = await fetchUserRegister(registerUsername.value, registerPassword.value, code, provider)
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

const getCaptcha = async () => {
	const res = await fetchCaptcha()
	registerCaptchaImage.value = `data:image/svg+xml;base64,${base64Encode(decodeURIComponent(encodeURIComponent(res.data)))}`
	// #ifdef MP-WEIXIN
	addWxCookie('future-token', res.cookies)
	// #endif
}

onMounted(async () => {
	if (isLogin.value) {
		uni.switchTab({
			url: '/pages/mine/index',
		})
	}
	await getCaptcha() // 建立session
	// #ifdef MP-WEIXIN
	checkOpenId() // 在session之后检查
	// #endif
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
text {
	flex-shrink: 0;
	color: #222;
	width: 55px;
	white-space: nowrap;
	text-align: left;
}
.register-btn-wrap {
	text-align: right;
	margin: 12px 0 0 0;
}
.register-btn {
	color: #628dd1;
	font-size: 12px;
}
.login-tips-wrap {
    margin-bottom: 12px;
    font-size: 12px;
	margin-top: -8px;
	color: #bbb;
	font-size: 12px;
}
.register-captcha {
	width: 100px;
	height: 33px;
	margin-left: 4px;
	flex-shrink: 0;
}
/**
 * 防止 ios 端输入框出现增强密码选项
 */
.display-input {
	height: 1px;
	width: 1px;
	min-height: 1px;
}
</style>
