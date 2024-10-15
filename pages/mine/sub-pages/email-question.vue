<template>
	<ux-nav color="#fff" :background="navBg">帮助</ux-nav>
	<view class="help">
		<view class="title-wrap">
			<view class="title-icon"></view>
			<view class="title-text">如何在微信接收价格变动提醒</view>
			<view class="title-icon rotateY"></view>
		</view>
		
		<view class="step-wrap">
			<view class="skew"><view class="skew-text">步骤一</view></view><text class="item-title">微信端设置</text>
		</view>
		<view class="item-content">
			<view class="item-sub-title-wrap">
				<view class="item-sub-title">微信搜索QQ邮箱提醒<br>并绑定订阅的邮箱</view>
				<uni-icons color="#999" type="right" size="12"></uni-icons>
				<view class="item-sub-title">进入QQ邮箱提醒设置<br>并勾选接收邮件提醒</view>
			</view>
			<view class="item-sub-title-wrap">
				<view style="width: 50%;">
					<img class="question-img" src="@/static/step/1.1.png">
				</view>
				<uni-icons color="#fff" type="right" size="12"></uni-icons>
				<view style="width: 50%;">
					<img class="question-img" src="@/static/step/1.2.png">
				</view>
			</view>
		</view>
	
		<view class="step-wrap">
			<view class="skew"><view class="skew-text">步骤二</view></view><text class="item-title">电脑端设置</text>
		</view>
		<view class="item-content">
			<view class="item-sub-title-wrap">
				<view class="item-sub-title"><text class="link" @click="toGuidePage">前往</text>安装页面复制链接<br>安装电脑端</view>
				<uni-icons color="#999" type="right" size="12"></uni-icons>
				<view class="item-sub-title">勾选启动邮件通知<br>并点击开始</view>
			</view>
			<view class="item-sub-title-wrap">
				<view style="width: 50%;">
					<img class="question-img" src="@/static/step/2-1.png">
				</view>
				<uni-icons color="#fff" type="right" size="12"></uni-icons>
				<view style="width: 50%;">
					<img class="question-img" src="@/static/step/2-2.png">
				</view>
			</view>
		</view>
	
		<view class="step-wrap">
			<view class="skew"><view class="skew-text">步骤三</view></view><text class="item-title">等待条件触发</text>
		</view>
		<view class="item-content">
			<view class="item-sub-title-wrap">
				<view class="item-sub-title">邮件提醒</view>
				<uni-icons color="#999" type="right" size="12"></uni-icons>
				<view class="item-sub-title">查看邮件内容</view>
			</view>
			<view class="item-sub-title-wrap">
				<view style="width: 50%;">
					<img class="question-img" src="@/static/step/3.1.png">
				</view>
				<uni-icons color="#fff" type="right" size="12"></uni-icons>
				<view style="width: 50%;">
					<img class="question-img" src="@/static/step/3.2.png">
				</view>
			</view>
		</view>
	</view>
	<view class="block"></view>
</template>

<script setup>
import { ref } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'

const navBg = ref('#ffd076')

if (uni.setBackgroundColor) {
	uni.setBackgroundColor({
	    backgroundColor: '#ffd076',
	})
}

onPageScroll(e => {
	if (e.scrollTop > 1) {
		navBg.value = '#fda646'
	} else {
		navBg.value = '#ffd076'
	}
})

const toGuidePage = () => {
	uni.navigateTo({
		url: '/pages/mine/sub-pages/guide',
	})
}

</script>

<style>
page {
	background: #ffd076;
}
</style>

<style scoped lang="scss">
.help {
	margin: $page-padding;
	padding: $page-padding;
	background-color: white;
	border-radius: 12px;
	font-size: 14px;
}
.title-wrap {
	display: flex;
	font-weight: bold;
	align-items: center;
	justify-content: center;
	padding: 6px 0 0 0;
}
.title-icon {
	width: 16px;
	height: 14px;
	background-image: url('@/static/coin.png');
	background-size: 100%;
}
.title-text {
	margin: 0 8px;
}
.rotateY {
	transform: rotateY(180deg);
}
.skew {
	display: inline-block;
	transform: skew(-10deg);
	background-color: #f53c28;
	border-radius: 3px;
	padding: 2px 4px;
	box-shadow: 3px 0 0 #fed9d1;
	font-size: 12px;
	color: white;
}
.skew-text {
	display: inline-block;
	transform: skew(10deg);
}
.step-wrap {
	margin-top: 24px;
}
.item-content {
	border-left: 1px solid #cfcfcf;
	padding-left: 22px;
	margin: 8px 0 0 22px;
}
.item-title {
	font-weight: bold;
	margin-left: 12px;
}
.item-sub-title-wrap {
	display: flex;
	align-items: center;
}
.item-sub-title-wrap .question-img {
	width: 100%;
	border-radius: 6px;
}
.item-sub-title {
	font-size: 12px;
	width: 50%;
	text-align: center;
	color: #747474;
	padding: 4px 0 8px 0;
}
.block {
	height: 24px;
	width: 100%;
}
</style>
