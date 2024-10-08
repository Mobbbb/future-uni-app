<template>
	<ux-nav color="#fff" background="linear-gradient(46deg, #21232b, #17171f 17%, #191b22 42%, #181b1f)">体验更多功能</ux-nav>
	<view class="guide">
		<view class="table-wrap">
			<view class="authority authority1 even_row">电脑端</view>
			<view class="authority authority8">同步期货市场监控中心数据</view>
			<view class="authority authority2 even_row">实时语音播报</view>
			<view class="authority authority3">图标闪烁提示</view>
			<view class="authority authority4 even_row">消息通知提醒</view>
			<view class="authority authority5">邮件通知</view>
			<view class="authority authority6 even_row">单边监控</view>
			<view class="authority authority7">套利监控</view>
		</view>
		<view class="copy-btn-wrap">
			<view class="half-width reach-me" @click="showReachMe = true">
				<text class="reach-me-text">联系我们</text>
			</view>
			<view class="half-width copy-btn" @click="setClipboardData(href, '链接已复制')">复制链接</view>
		</view>
		<ux-dialog v-model="showReachMe">
			<view class="dialog-wrap">
				<view class="dialog-item mb-8" @click="setClipboardData('mobbbb.top@gmail.com', '邮箱已复制')">
					<uni-icons type="email-filled" size="20" color="#606266"></uni-icons><text class="dialog-title">mobbbb.top@gmail.com</text>
				</view>
				<view class="dialog-item" @click="setClipboardData('_Silver_', '微信已复制')">
					<uni-icons type="weixin" size="20" color="#606266"></uni-icons><text class="dialog-title">_Silver_</text>
				</view>
			</view>
		</ux-dialog>
	</view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { fetchAppVersion } from '@/request.api/index.js'

const store = new useStore()

const href = ref()
const showReachMe = ref(false)
const futuresList = computed(() => store.getters['order/futuresList'])
const commissionType = computed(() => store.state.app.USER_INFO.commissionType || 4)

const setClipboardData = (value, msg) => {
	if (value) {
		uni.setClipboardData({
			data: value,
			success: function () {
				ElMessage.success(msg)
			}
		})
	} else {
		ElMessage.error('安装地址错误')
	}
}

if (uni.setBackgroundColor) {
	uni.setBackgroundColor({
	    backgroundColor: '#1e2024',
	})
}

onMounted(async () => {
	const result = await fetchAppVersion()
	const { data } = result || {}
	if (data.href) {
		href.value = `使用电脑打开链接，下载安装即可使用。\n链接：${data.href}`
	}
})

</script>

<style>
page {
	background: linear-gradient(134deg, #21232b, #17171f 17%, #191b22 42%, #181b1f);
	overflow-y: scroll;
}
</style>

<style scoped lang="scss">
.guide {
	padding: $page-padding;
}
.table-wrap {
	border-radius: 2px;
	width: 100%;
	position: relative;
	text-align: center;
	border: 4px solid;
	border-image: linear-gradient(317deg, #d89c75, #efdfd0) 4 4;
	background: #746c63;
	box-sizing: border-box;
	margin-bottom: 24px;
}
.authority {
	position: relative;
	padding: 16px 0;
	height: 34px;
	line-height: 34px;
	font-size: 18px;
	text-align: center;
	color: #fff;
}
.authority:first-child {
	height: 50px;
	line-height: 50px;
	font-size: 26px;
}
.authority:before {
    // content: attr(content-text); 小程序无法生效
    display: inline-block;
    position: absolute;
    left: 50%;
    white-space: nowrap;
    transform: translate(-50%);
    color: #d89c75;
    z-index: 2;
    mask-image: -webkit-gradient(linear, 0 0, right 0, from(transparent), to(#d89c75));
}
.authority1:before {
    content: '电脑端';
}
.authority2:before {
    content: '实时语音播报';
}
.authority3:before {
    content: '图标闪烁提示';
}
.authority4:before {
    content: '消息通知提醒';
}
.authority5:before {
    content: '邮件通知';
}
.authority6:before {
    content: '单边监控';
}
.authority7:before {
    content: '套利监控';
}
.authority8:before {
    content: '同步期货市场监控中心数据';
}
.even_row {
	background: rgba(0, 0, 0, .1);
}
.copy-btn-wrap {
	display: flex;
	align-items: center;
	width: 280px;
	margin: 0 auto;
	height: 48px;
	background-size: 100% 100%;
	background-image: url('data:image/png;base64,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');
}
.half-width {
	width: 124px;
	line-height: 29px;
	font-size: 15px;
	text-align: center;
}
.reach-me {
	padding-left: 18px;
}
.reach-me-text {
	position: relative;
	color: #efdfd0;
}
.reach-me-text:before {
	content: '联系我们';
	display: inline-block;
	position: absolute;
	white-space: nowrap;
	color: #d89c75;
	z-index: 2;
	mask-image: -webkit-gradient(linear, 0 0, right 0, from(transparent), to(#d89c75));
}
.copy-btn {
	font-weight: 700;
	border-radius: 0 40px 40px 0;
	color: #1e2024;
	cursor: pointer;
	background: linear-gradient(270deg, #d89c75, #efdfd0);
}
.copy-btn:active {
	background: linear-gradient(270deg,#b37957,#e0ba97);
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
</style>
