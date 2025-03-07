<template>
	<view class="subscribe-wrap">
		<ux-nav background="linear-gradient(180deg, #1994fb, #2e9efb 100%)" color="white">油价订阅</ux-nav>
		<view class="subscribe-body">
			<view class="step-wrap">
				<view class="step-tips card">
					<view class="mail-icon"><view class="icon-image"></view></view>
					<view class="subscribe-right">
						<view>设置邮箱</view>
						<text class="setting-text" style="color: #999;" v-if="userEmail">已设置</text>
						<text class="setting-text" v-else @click="toEmailPage">去设置</text>
					</view>
				</view>
				<view class="step-tips card">
					<view class="icon-image"></view>
					<view class="subscribe-right">
						<view>开启订阅</view>
						<view @click="clickSwitch">
							<switch class="switch-btn" :disabled="!userEmail" :checked="status" color="rgb(4, 190, 2)" @change="switchChange" />
						</view>
					</view>
				</view>
			</view>
			<view class="price card" v-if="newData.y98">
				<view class="number-wrap">
					<text class="number number-hash">
						<text>98</text>
						<text class="number-icon">#</text>
					</text>
					<text>汽油</text>
				</view>
				<view>
					<text class="derta" v-if="!isNaN(Number(newData.derta98))"
						:style="{ color: newData.derta98 > 0 ? 'rgb(235, 68, 54)' : (newData.derta98 < 0 ? 'rgb(14, 157, 88)' : '#222') }">
						{{ newData.derta98 }}
					</text>
					<text class="number">{{ newData.y98 }}</text>
					<text class="unit">元/升</text>
				</view>
			</view>
			<view class="price card" v-if="newData.y95">
				<view class="number-wrap">
					<text class="number number-hash">
						<text>95</text>
						<text class="number-icon">#</text>
					</text>
					<text>汽油</text>
				</view>
				<view>
					<text class="derta" v-if="!isNaN(Number(newData.derta95))"
						:style="{ color: newData.derta95 > 0 ? 'rgb(235, 68, 54)' : (newData.derta95 < 0 ? 'rgb(14, 157, 88)' : '#222') }">
						{{ newData.derta95 }}
					</text>
					<text class="number">{{ newData.y95 }}</text>
					<text class="unit">元/升</text>
				</view>
			</view>
			<view class="price card" v-if="newData.y92">
				<view class="number-wrap">
					<text class="number number-hash">
						<text>92</text>
						<text class="number-icon">#</text>
					</text>
					<text>汽油</text>
				</view>
				<view>
					<text class="derta" v-if="!isNaN(Number(newData.derta92))"
						:style="{ color: newData.derta92 > 0 ? 'rgb(235, 68, 54)' : (newData.derta92 < 0 ? 'rgb(14, 157, 88)' : '#222') }">
						{{ newData.derta92 }}
					</text>
					<text class="number">{{ newData.y92 }}</text>
					<text class="unit">元/升</text>
				</view>
			</view>
			<view class="chart95 card" @touchmove.stop>
				<view class="area" v-if="newData.area">{{ newData.area }}</view>
				<l-echart ref="chartRef"></l-echart>
			</view>
			<view class="time-wrap broder-card">
				<view class="text-wrap" v-if="nextPubDay"><view>下次调价日期：</view><text class="time-value">{{ nextPubDay }}</text></view>
				<view class="text-wrap" v-if="newData.date"><view>上次调价时间：</view><text class="time-value">{{ newData.date.indexOf('09:00:00') > -1 ? newData.createTime : newData.date }}</text></view>
				<view class="tips" style="padding: 2px 0 0 0;">*实际生效时间为 {{ nextDay }}*</view>
			</view>
			<view class="tips">*数据为计算结果，与实际油价可能存在偏差，请以实际价格为准*</view>

			<canvas class="oil-info" id="OilInfo" canvas-id="OilInfo"></canvas>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, watch, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { updateSubscribe95, getAllOilList, getOilDate } from '@/request.api/index.js'
import { getLineOption } from './option'
import { dateFormat } from '@/utils/umob.js'
import { canvasToImage } from '@/utils/index.js'
import { onShareAppMessage } from '@dcloudio/uni-app'

// #ifdef MP-WEIXIN
const echarts = require('../../../uni_modules/lime-echart/static/echarts.min')
// #endif

// #ifndef MP-WEIXIN
import * as echarts from 'echarts'
// #endif

const store = new useStore()

const basePrice = [9465, 8.035, 7.555, 9.5247] // ave

const drawImgUrl = ref('')
const nextPubDay = ref('')
const status = ref(false)
const chartRef = ref(null)
const newData = ref({ // 当前数据库最新数据
	y98: 0,
	y95: 0,
	y92: 0,
	date: '',
	createTime: '',
	area: '',
	derta98: 0,
	derta95: 0,
	derta92: 0,
})

const userEmail = computed(() => store.state.app.USER_INFO.email || '')
const remoteStatus = computed(() => store.state.app.USER_INFO.subscribe95 || 0)
const nextDay = computed(() => {
	const iosDate = newData.value.date.replaceAll('-', '/')
	const timestamp = new Date(iosDate).getTime() + 24 * 60 * 60 * 1000
	if (!isNaN(timestamp)) {
		return `${dateFormat(timestamp)} 00:00:00`
	}
	return ''
})

const setSubscribe95 = (status) => store.commit('app/setSubscribe95', status)

const renderOilPrice = async () => {
	const { data, success } = await getAllOilList()
	
	const echartLists = {
	    y92: [],
	    y95: [],
	    y98: [],
	    x: [],
	}
	if (success) {
		echartLists.y98 = data.map(item => item.o98 || (item.qy / basePrice[0] * basePrice[3]).toFixed(2))
		echartLists.y95 = data.map(item => item.o95 || (item.qy / basePrice[0] * basePrice[1]).toFixed(2))
		echartLists.y92 = data.map(item => item.o92 || (item.qy / basePrice[0] * basePrice[2]).toFixed(2))
		echartLists.x = data.map(item => {
			const iosDate = item.date.replaceAll('-', '/')
			const timestamp = new Date(iosDate).getTime() + 24 * 60 * 60 * 1000
			return dateFormat(timestamp)
		})
		const length = data.length
		newData.value.y98 = echartLists.y98[length - 1]
		newData.value.y95 = echartLists.y95[length - 1]
		newData.value.y92 = echartLists.y92[length - 1]
		newData.value.derta98 = (newData.value.y98 - echartLists.y98[length - 2]).toFixed(2)
		newData.value.derta95 = (newData.value.y95 - echartLists.y95[length - 2]).toFixed(2)
		newData.value.derta92 = (newData.value.y92 - echartLists.y92[length - 2]).toFixed(2)
		newData.value.date = data[length - 1].date
		newData.value.createTime = dateFormat(new Date(data[length - 1].createTime), 'yyyy-MM-dd hh:mm:ss')
		newData.value.area = data[0].area

		echartLists.y98 = echartLists.y98.slice(length - 5, length)
		echartLists.y95 = echartLists.y95.slice(length - 5, length)
		echartLists.y92 = echartLists.y92.slice(length - 5, length)
		echartLists.x = echartLists.x.slice(length - 5, length)
	}

	const myChart = await chartRef.value.init(echarts)
	myChart.setOption(getLineOption(echartLists))
}

const getNextDate = async () => {
	const oilRes = await getOilDate()
	let oilDate = oilRes.data && oilRes.data[0] && oilRes.data[0].date_status || ''
	oilDate = oilDate.split(',')
	oilDate.sort((a, b) => a > b ? 1 : -1)
	const nowDate = dateFormat(new Date())
	if (nowDate === dateFormat(newData.value.date) || !oilDate.includes(nowDate)) {
		// 今天是公布日，且今天已公布
		// 今天不是公布日
		oilDate = oilDate.filter(item => item > nowDate)
		nextPubDay.value = oilDate[0] || ''
	} else if (oilDate.includes(nowDate) && nowDate !== dateFormat(newData.value.date)) {
		// 今天是公布日，且今天未公布
		nextPubDay.value = `今天 (暂未公布)`
	} else {
		nextPubDay.value = nowDate
	}
}

const toEmailPage = () => {
	uni.navigateTo({
		url: '/pages/mine/sub-pages/email-setting',
	})
}

const switchChange = async (params) => {
	status.value = params.detail.value
	const res = await updateSubscribe95(status.value ? 1 : 0)
	if (res.success) {
		ElMessage.success(status.value ? '已开启' : '已关闭')
		setSubscribe95(status.value)
	}
}

const clickSwitch = () => {
	if (!userEmail.value) {
		ElMessage.error('请先设置邮箱')
	}
}

const drawCanvas = () => {
	return new Promise(resolve => {
		const lineGap = 90
		const context = uni.createCanvasContext('OilInfo')

		context.setFontSize(16)
		context.setFillStyle('#8e8e8e')
		context.setTextAlign('left')
		context.fillText(dateFormat(nextDay.value), 13, 35, 395)
		context.fillText(newData.value.area, 333, 35, 395)
		context.stroke()

		drawLine('98', { value1: newData.value.y98, value2: newData.value.derta98 }, context, lineGap * 0)
		drawLine('95', { value1: newData.value.y95, value2: newData.value.derta95 }, context, lineGap * 1)
		drawLine('92', { value1: newData.value.y92, value2: newData.value.derta92 }, context, lineGap * 2)
		context.draw(false, () => {
			resolve()
		})
	})
}

const drawLine = (label, data, context, y) => {
	const top = 95
	const left = 12
	const right = 395 - left
	y = y + top
	context.setStrokeStyle('#e4e7ed')
	context.setFillStyle('#fff')
	context.setLineWidth(1)
	context.setShadow(0, 2, 12, 'rgba(0, 0, 0, 0.1)')
	context.strokeRect(left, y - 43, right - left, 66)
	context.fillRect(left, y - 43, right - left, 66)
	context.stroke()

	context.setFontSize(18)
	context.setFillStyle('#222')
	context.setTextAlign('left')
	context.fillText('汽油', left + 75, y - 2, 395)
	context.stroke()
	context.setFontSize(12)
	context.setFillStyle('#222')
	context.setTextAlign('left')
	context.fillText('#', left + 52, y - 14, 395)
	context.stroke()
	context.setFontSize(30)
	context.setFillStyle('#222')
	context.setTextAlign('left')
	context.fillText(label, left + 17, y, 395)
	context.fillText(data.value1, right - 120, y, 395)
	context.stroke()
	context.setFontSize(18)
	context.setFillStyle('#999')
	context.setTextAlign('left')
	context.fillText('元/升', right - 54, y - 2, 395)
	context.stroke()
	context.setFontSize(14)
	const color = data.value2 > 0 ? 'rgb(235, 68, 54)' : (data.value2 < 0 ? 'rgb(14, 157, 88)' : '#222')
	context.setFillStyle(color)
	context.setTextAlign('left')
	context.fillText(data.value2, right - 162, y, 395)
	context.stroke()
}

const drawImage = async () => {
	await drawCanvas()
	const res = await canvasToImage('OilInfo')
	if (res.success) {
		drawImgUrl.value = res.data
	} else {
		ElMessage.success(res.msg)
	}
}

watch(remoteStatus, (value) => {
	if (value) {
		status.value = !!remoteStatus.value
	}
})

onMounted(async () => {
	status.value = !!remoteStatus.value
	await renderOilPrice()
	getNextDate()

	// #ifdef MP-WEIXIN
	drawImage()
	// #endif
})

if (uni.setBackgroundColor) {
	uni.setBackgroundColor({
	    backgroundColorTop: '#2e9efc', // 不可与 css page -> background 值一样，否则将不生效
		backgroundColorBottom: '#ffffff',
	})
}

onShareAppMessage(() => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const { route } = currentPage || {}
	const { proxy } = getCurrentInstance()
	const value = Math.round(newData.value.derta95 * 50)

	proxy.setShareInfo({
		title: value === 0 ? '本次油价调整无变动' : `对比上次油价，每50升油${value > 0 ? '需多花费' : '可节省'}${Math.abs(value)}元`,
		imageUrl: drawImgUrl.value,
		path: route,
	})
})

</script>

<style lang="scss">
page {
	height: 100%;
	background: #2e9efb;
}
</style>

<style scoped lang="scss">
.card {
	border-radius: 4px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	background-color: #fff;
}
.broder-card {
	border: 1px solid #e4e7ed;
	border-radius: 4px;
	box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
	background-color: #fff;
}

.subscribe-wrap {
	display: flex;
	height: 100%;
	flex-direction: column;
}
.subscribe-body {
	overflow-y: scroll;
	padding: 0 $page-padding;
	flex: 1;
	background: linear-gradient(180deg, #2e9efb, #fff 70%);
}
.step-wrap {
	display: flex;
	margin-bottom: 12px;
	padding-top: 12px;
}
.step-tips {
	padding: 12px 14px;
	font-size: 14px;
	display: flex;
	margin-right: 12px;
	border-radius: 8px;
}
.subscribe-right {
	position: relative;
	margin-left: 12px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.setting-text {
	color: #628dd1;
	font-size: 17px;
	margin-bottom: 4px;
}
.switch-btn {
	position: absolute;
	transform: scaleY(0.85);
	margin: auto 0;
	height: 32px;
	bottom: 0;
}
.icon-image {
	background-image: url('../../../static/subscribe.png');
	background-size: 100% 100%;
	width: 56px;
	height: 56px;
}
.mail-icon {
	width: 56px;
	height: 56px;
	background-color: #edf3ff;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.mail-icon .icon-image {
	background-image: url('../../../static/mail-fill.png');
	width: 42px;
	height: 42px;
}
.price {
	padding: 8px 20px;
	background: #fff;
	margin-bottom: 12px;
	display: flex;
	justify-content: space-between;
}
.number-wrap {
	font-size: 14px;
	display: flex;
	align-items: center;
	margin-right: 24px;
}
.derta {
	margin-right: 8px;
	font-size: 14px;
}
.number {
	font-size: 25px;
	position: relative;
	margin-right: 8px;
}
.number-hash {
	padding-right: 12px;
}
.number-icon {
	position: absolute;
	font-size: 12px;
	right: 0;
	top: 0;
}
.unit {
	color: #999;
	font-size: 14px;
}
.chart95 {
	height: 300px;
	width: 100%;
	padding-right: 12px;
	padding-top: 4px;
	padding-bottom: 6px;
	box-sizing: border-box;
	position: relative;
}
.area {
	position: absolute;
	right: 26px;
	top: 16px;
	font-size: 12px;
	color: #8e8e8e;
}
.text-wrap {
	display: flex;
	text-align: justify;
	margin-top: 2px;
	color: #222;
}
.text-wrap view {
	width: 130px;
	height: 22px;
	text-align: justify;
}
.text-wrap view::after {
	content: '';
	width: 100%;
	height: 0;
	overflow: hidden;
	display: inline-block;
}
.time-wrap {
	padding: 12px;
	margin: 12px 0;
}
.time-value {
	color: #606266;
}
.tips {
	font-size: 12px;
	color: #c0c4d6;
	padding-bottom: 24px;
}
.oil-info {
	width: 395px;
	height: 316px;
	position: fixed;
	z-index: -99999;
	opacity: 0;
	visibility: hidden;
	left: -400px;
}
</style>
