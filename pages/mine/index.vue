<template>
	<ux-nav :showBack="false" background="f5f6f7"></ux-nav>
	<view class="mine-wrap">
		<view class="mine-top-wrap" v-if="isLogin">
			<img class="avatar-img" :src="avatarImg" v-if="avatarImg">
			<view class="default-avatar-wrap" v-else>
				<uni-icons color="#656565" type="person-filled" size="30"></uni-icons>
			</view>
			<view>
				<view class="login-text">{{ USER_INFO.name }}</view>
				<view class="login-sub-text">{{ USER_INFO.userId }}</view>
			</view>
		</view>
		<view class="mine-top-wrap" @click="login" v-else>
			<view class="default-avatar-wrap">
				<uni-icons color="#656565" type="person-filled" size="30"></uni-icons>
			</view>
			<view class="login-text">登录/注册</view>
		</view>
		<view class="mine-card-wrap">
			<view class="insert-card-wrap" :style="{ backgroundImage: `url(${base64.userBg})` }" @click="toGuidePage">
				<view>
					<view class="card-user-time" v-if="!isLogin">您当前还未登录</view>
					<view class="card-user-time" v-else-if="isProExpire">此账户未开通邮件通知功能</view>
					<view class="card-user-time" v-else-if="USER_INFO.proTime">邮件通知将于 {{USER_INFO.proTime.slice(0, 10)}} 到期</view>
					<view class="card-user-time" v-else>邮件通知将于9999-12-31到期</view>
					<view class="card-user-tips" v-if="isProExpire">安装电脑端，联系我们开启邮件通知 <uni-icons color="#999" type="right" size="12"></uni-icons></view>
					<view class="card-user-tips" v-else>安装电脑端，开启邮件通知以及更多功能 <uni-icons color="#999" type="right" size="12"></uni-icons></view>
				</view>
				<view class="pro-btn">
					<view class="pro-icon" :style="{ backgroundImage: `url(${base64.pro})` }"></view>
					<text v-if="!isLogin">登录</text>
					<text v-else>前往</text>
				</view>
			</view>
			<view class="ux-card">
				<uni-list>
					<uni-list-item title="优先平今" link to="/pages/mine/sub-pages/close-setting" note="设置优先平仓的品种" showArrow
						:thumb="base64.set"
						thumb-size="medium" rightText="去设置" />
					<uni-list-item title="品种简介" link to="/pages/mine/sub-pages/introduction" note="合约详细信息" showArrow
						:thumb="base64.list"
						thumb-size="medium" rightText="去查看" />
					<uni-list-item title="邮件订阅" link to="/pages/mine/sub-pages/email-setting" note="价格波动邮件提醒" showArrow
						:thumb="base64.mail"
						thumb-size="medium" :rightText="USER_INFO.email ? '已设置' : '去设置'" />
				</uni-list>
			</view>
		</view>
        <button v-if="isLogin" style="margin-top: 24px;" type="buy" @click="logout">退出登录</button>
		<view class="bottom-text">
			<text>{{ versionStr }}</text>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useStore } from 'vuex'
import { baseUrl } from '@/request.api/index.js'
import base64 from '@/config/base64.js'

const store = new useStore()

const versionStr = ref('')

const isProExpire = computed(() => store.getters['app/isProExpire'])
const isLogin = computed(() => store.getters['app/isLogin'])
const USER_INFO = computed(() => store.state.app.USER_INFO)

const avatarImg = computed(() => {
	const { avatar } = USER_INFO.value
	if (avatar) {
		// #ifdef MP-WEIXIN
		return baseUrl + avatar
		// #endif
		
		// #ifndef MP-WEIXIN
		return avatar
		// #endif
	}

	return ''
})

const setLoginDrawerStatus = (status) => store.commit('app/setLoginDrawerStatus', status)
const logoutImmAction = () => store.dispatch('app/logoutImmAction')

const toGuidePage = () => {
	if (!isLogin.value) {
		setLoginDrawerStatus(true)
		return
	}
	uni.navigateTo({
		url: '/pages/mine/sub-pages/guide',
	})
}

const login = () => {
	setLoginDrawerStatus(true)
}

const logout = () => {
	logoutImmAction()
}

const setClipboardData = (value) => {
	uni.setClipboardData({
		data: value,
		success: function () {
			ElMessage.success('内容已复制')
		}
	})
}

onMounted(() => {
	if (uni.getAccountInfoSync) {
		const { miniProgram = {} } = uni.getAccountInfoSync()
		const { version = '' } = miniProgram
		versionStr.value = version
	}
})

</script>

<style lang="scss">
page {
	background-color: $base-background-color;
}
</style>

<style scoped lang="scss">
.mine-wrap {
	padding: 0 $page-padding;
}
.mine-top-wrap {
	display: flex;
	align-items: center;
	padding: 24px 0 24px 12px;
}
.default-avatar-wrap {
	width: 70px;
	height: 70px;
	border-radius: 70px;
	background-color: #c9c9c9;
	margin-right: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.login-text {
	font-weight: bold;
	font-size: 20px;
}
.login-sub-text {
	font-weight: normal;
	font-size: 12px;
	margin-top: 4px;
}
.avatar-img {
	width: 70px;
	height: 70px;
	border-radius: 70px;
	margin-right: 16px;
}
.bottom-text {
	text-align: center;
	font-size: 12px;
	margin-top: 24px;
	color: #a3a3a3;
}
.dialog-wrap {
	font-size: 12px;
	line-height: 20px;
}
.dialog-title {
	margin-left: 8px;
	padding-bottom: 2px;
}
.dialog-title:active {
	color: #a1a1a1;
}
.dialog-item {
	display: flex;
	align-items: center;
}
.mine-card-wrap {
	position: relative;
	height: 255px;
}
.insert-card-wrap {
	height: 80px;
	color: #eaeaea;
	background-color: #4c4942;
	background-size: 100% 100%;
	border-radius: 16px 16px 0 0;
	display: flex;
	align-items: center;
	padding: 0 15px;
	padding-bottom: 16px;
	box-sizing: border-box;
	justify-content: space-between;
}
.mine-card-wrap .ux-card {
	position: absolute;
	width: 100%;
	border-radius: 16px;
	overflow: hidden;
	top: 65px;
}
.card-user-time {
	color: #eaeaea;
	font-size: 14px;
	margin-bottom: 4px;
}
.card-user-tips {
	color: #999;
	font-size: 12px;
}
.pro-icon {
	width: 22px;
	height: 22px;
	background-size: 100% 100%;
	margin-right: 2px;
}
.pro-btn {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 80px;
	height: 34px;
	line-height: 34px;
	text-align: center;
	text-decoration: none;
	font-weight: 500;
	font-size: 13px;
	color: #663d00;
	background: linear-gradient(90deg,#FFDF89 0%,#F2CA5B 100%);
	border-radius: 21px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	cursor: pointer;
}
</style>
