<template>
	<ux-nav :showBack="false" background="f5f6f7"></ux-nav>
	<view class="mine-wrap">
		<view class="mine-top-wrap" v-if="isLogin" @click="toSettingPage">
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
					<view class="card-user-time" v-else>邮件通知将于 9999-12-31 到期</view>

					<view class="card-user-tips" v-if="!isLogin">赶快前往登录，体验新功能吧 <uni-icons color="#999" type="right" size="12"></uni-icons></view>
					<view class="card-user-tips" v-else-if="isProExpire">安装电脑端，联系我们开启邮件通知 <uni-icons color="#999" type="right" size="12"></uni-icons></view>
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
					<uni-list-item title="邮箱设置" link to="/pages/mine/sub-pages/email-setting" note="期货价格波动/成品油价调整通知" showArrow
						:thumb="base64.mail"
						thumb-size="medium" :rightText="USER_INFO.email ? '已设置' : '去设置'" />
					<uni-list-item title="油价订阅" link to="/pages/mine/sub-pages/subscribe95-setting" note="92#95#98#汽油价格调整邮件通知" showArrow
						:thumb="base64.subscribe"
						thumb-size="medium" :rightText="USER_INFO.subscribe95 ? '已订阅' : '去订阅'" />
				</uni-list>
			</view>
		</view>
        <button v-if="isLogin" style="margin-bottom: 24px;" type="buy" @click="logout">退出登录</button>
		<view class="bottom-text">
			<text style="color: #628dd1;" @click="showReachMe = true">关于我们</text>
			<text class="text-line">|</text>
			<text style="color: #628dd1;" @click="setClipboardData">网页端</text>
			<text class="text-line">|</text>
			<text>{{ versionStr || '1.0.0' }}</text>
		</view>
		<ux-dialog v-model="showReachMe">
			<ReachMe></ReachMe>
		</ux-dialog>
	</view>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useStore } from 'vuex'
import base64 from '@/config/base64.js'
import ReachMe from './sub-pages/reach-me.vue'

const store = new useStore()

const showReachMe = ref(false)
const versionStr = ref('')

const isProExpire = computed(() => store.getters['app/isProExpire'])
const isLogin = computed(() => store.getters['app/isLogin'])
const avatarImg = computed(() => store.getters['app/avatarImg'])
const USER_INFO = computed(() => store.state.app.USER_INFO)

const toLoginPage = () => store.commit('app/toLoginPage')
const logoutImmAction = () => store.dispatch('app/logoutImmAction')

const toGuidePage = () => {
	if (!isLogin.value) {
		toLoginPage()
		return
	}
	uni.navigateTo({
		url: '/pages/mine/sub-pages/guide',
	})
}

const toSettingPage = () => {
	uni.navigateTo({
		url: '/pages/mine/sub-pages/user-setting',
	})
}

const login = () => {
	toLoginPage()
}

const logout = () => {
	logoutImmAction()
}

const setClipboardData = () => {
	uni.setClipboardData({
		data: 'https://www.mobbbb.top/future/',
		success: function () {
			ElMessage.success('链接已复制')
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
	padding: 0 0 24px 0;
	color: #a3a3a3;
}
.mine-card-wrap {
	position: relative;
	margin-bottom: 24px;
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
	width: 100%;
	border-radius: 16px;
	overflow: hidden;
	top: 65px;
	margin-top: -15px;
}
.card-user-time {
	color: #eaeaea;
	font-size: 14px;
	margin-bottom: 4px;
	white-space: nowrap;
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
.text-line {
	transform: scaleY(0.8);
	display: inline-block;
	color: #d9d9d9;
	margin: 0 12px;
}
</style>
