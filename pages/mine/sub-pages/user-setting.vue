<template>
	<ux-nav>个人资料</ux-nav>
	<view class="user-setting-config">
		<view class="mine-top-wrap">
			<view class="avatar-img-wrap">
				<img class="avatar-img" :src="avatarImg" v-if="avatarImg">
				<view class="default-avatar-wrap" v-else>
					<uni-icons color="#656565" type="person-filled" size="30"></uni-icons>
				</view>
				<button open-type="getUserInfo" @getuserinfo="getUserInfo" class="set-image"></button>
			</view>
			<view v-if="isLogin">
				<view class="login-text" v-if="isFocus">
					<uni-easyinput
						:maxlength="8"
						:styles="styles"
						:placeholderStyle="placeholderStyle"
						v-model="settingInfo.name"
						:clearable="false"
						placeholder="请输入昵称"
						:focus="isFocus"
						@focus="isFocus = true"
						@blur="isFocus = false">
					</uni-easyinput>
				</view>
				<view class="login-text" v-else @click="isFocus = true">
					<view style="height: 40px;line-height: 40px;">{{ settingInfo.name }}</view>
					<img class="edit-img" src="@/static/edit-icon.png">
				</view>
			</view>
			<view class="login-text" v-else>
				<view style="height: 40px;line-height: 40px;">游客</view>
			</view>
		</view>
		
		<view class="line-wrap first-line">
			<text class="line-title">简介</text>
			<uni-easyinput v-if="isLogin" :maxlength="20" :styles="styles" :placeholderStyle="placeholderStyle" v-model="settingInfo.remark" :clearable="false" placeholder="请完善简介"></uni-easyinput>
			<view class="limit-text" v-if="isLogin">({{ settingInfo.remark.length }}/20)</view>
		</view>
		<view class="line-wrap" style="display: flex;justify-content: space-between;">
			<text class="line-title">手续费</text>
			<view style="width: 70px;" v-if="isLogin">
				<uni-data-select v-model="settingInfo.commissionType" :localdata="commissionTypeList" :disabled="!isLogin" :clear="false"></uni-data-select>
			</view>
		</view>
		<view class="limit-text" style="margin: 24px 0 8px 24px;">账号绑定</view>
		<view class="line-wrap flex" style="padding: 14px 24px;">
			<view class="flex">
				<uni-icons type="weixin" color="#3b4144" size="24" style="margin-right: 6px;"></uni-icons>
				<text>微信</text>
			</view>
			<view>
				<text v-if="USER_INFO.openid" style="color: #d5d5d5;">已绑定</text>
				<view class="flex" v-else style="color: #1e67da;" @click="openConfirmDialog">
					去绑定
					<uni-icons color="#999" type="right" size="12" style="margin-left: 4px;"></uni-icons>
				</view>
			</view>
		</view>
		<uni-popup ref="confirmDialog" type="dialog">
			<uni-popup-dialog type="warn"
				cancelText="取消"
				confirmText="绑定"
				title="提示"
				content="同一微信只可绑定一个账号，绑定后可在微信一键登录。" 
				@confirm="confirm"
				@close="closeConfirmDialog">
			</uni-popup-dialog>
		</uni-popup>
        <button :disabled="!isLogin || !hasChanged" style="margin: 36px 24px;border-radius: 24px;" type="buy" @click="save">保存</button>
	</view>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { setOpenid, updateUserInfo, updateUserAvatar } from '@/request.api/index.js'
import { getLoginCode } from '@/utils'

const styles = {
	height: '46px',
	backgroundColor: '#fff',
}

const placeholderStyle = 'font-size: 14px;'

const commissionTypeList = [
	{ value: 1, text: '1倍' },
	{ value: 4, text: '4倍' },
]

const isFocus = ref(false)
const confirmDialog = ref()
const settingInfo = reactive({
	commissionType: 4,
	remark: '',
	name: '',
})

const store = new useStore()

const USER_INFO = computed(() => store.state.app.USER_INFO)
const isLogin = computed(() => store.getters['app/isLogin'])
const avatarImg = computed(() => store.getters['app/avatarImg'])
const hasChanged = computed(() => {
	return settingInfo.commissionType !== USER_INFO.value.commissionType
		|| settingInfo.remark !== USER_INFO.value.remark
		|| settingInfo.name !== USER_INFO.value.name
})

const logoutAction = () => store.dispatch('app/logoutAction')
const INIT_USER = () => store.dispatch('app/INIT_USER')

const getUserInfo = async (e) => {
	const { userInfo = {} } = e.detail
	const { avatarUrl = '' } = userInfo
	if (avatarUrl) {
		const res = await updateUserAvatar(avatarUrl)
		if (res.success) {
			INIT_USER()
		}
	}
}

const openConfirmDialog = () => {
    if (isLogin.value) {
		confirmDialog.value.open()
	} else {
		ElMessage.error('请先登录')
		logoutAction()
	}
}

const closeConfirmDialog = () => {
    confirmDialog.value.close()
}

const confirm = async () => {
	const { code, provider } = await getLoginCode()
	const res = await setOpenid({ code, provider })
	ElMessage.success(res.success ? '绑定成功' : '绑定失败')
    confirmDialog.value.close()
	if (res.success) {
		INIT_USER()
	}
}

const save = async () => {
	if (!settingInfo.name) {
		ElMessage.error('昵称不得为空')
	} else if (!settingInfo.remark) {
		ElMessage.error('简介不得为空')
	} else if (!settingInfo.commissionType) {
		ElMessage.error('手续费不得为空')
	} else {
		const res = await updateUserInfo(settingInfo)
		ElMessage.success(res.success ? '保存成功' : '保存失败')
		if (res.success) {
			INIT_USER()
		}
	}
}

watch(USER_INFO, (value) => {
	settingInfo.commissionType = USER_INFO.value.commissionType || 4
	settingInfo.remark = USER_INFO.value.remark || ''
	settingInfo.name = USER_INFO.value.name || ''
})

onMounted(() => {
	settingInfo.commissionType = USER_INFO.value.commissionType || 4
	settingInfo.remark = USER_INFO.value.remark || ''
	settingInfo.name = USER_INFO.value.name || ''
})

</script>

<style lang="scss">
page {
	background-color: $base-background-color;
}
</style>

<style scoped lang="scss">
.user-setting-config {
	color: #3b4144;
	font-size: 14px;
}
.mine-top-wrap {
	display: flex;
	align-items: center;
	flex-direction: column;
	padding: 24px 0;
	background-color: white;
}
.avatar-img-wrap {
	width: 70px;
	height: 70px;
	position: relative;
}
.avatar-img {
	width: 100%;
	height: 100%;
	border-radius: 70px;
}
.set-image {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background-color: transparent;
	border: none;
}
.set-image::after {
	display: none;
}
.default-avatar-wrap {
	width: 100%;
	height: 100%;
	border-radius: 70px;
	background-color: #c9c9c9;
	display: flex;
	align-items: center;
	justify-content: center;
}
.login-text {
	margin-top: 4px;
	display: flex;
	align-items: center;
}
.edit-img {
	width: 16px;
	height: 16px;
	margin-left: 4px;
}
.line-wrap {
	display: flex;
	align-items: center;
	background-color: white;
	padding: 6px 24px;
}
.first-line {
	margin-top: 8px;
	border-bottom: 1px solid #f0f0f0;
}
.line-wrap .line-title {
	width: 50px;
	height: 40px;
	line-height: 40px;
}
.limit-text {
	color: #999;
	white-space: nowrap;
}
.flex {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>

<style>
.user-setting-config >>> .uni-easyinput__content {
	border: none;
}
.user-setting-config >>> .uni-easyinput__content-input {
	height: 40px;
	font-size: 14px;
	text-align: right;
}
.login-text >>> .uni-easyinput__content-input {
	text-align: center;
}

.user-setting-config >>> .uni-select {
	border: none;
	text-align: right;
	height: 40px;
}
.user-setting-config >>> .uni-select__input-box {
	height: 40px;
}
.user-setting-config >>> .uni-select__input-text {
	padding-right: 12px;
	color: #3b4144;
}
.user-setting-config >>> .uni-popper__arrow_bottom {
	right: 10%;
	margin: 0 auto;
}
.user-setting-config >>> .uni-select__selector-item {
	justify-content: center;
}
</style>