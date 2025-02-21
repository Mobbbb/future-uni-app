<template>
	<ux-nav>品种简介</ux-nav>
	<canvas class="future-info" id="FutureInfo" canvas-id="FutureInfo"></canvas>
	<view class="introduction">
		<uni-collapse v-model="openIndex" accordion v-if="futuresList.length" @change="changeCollapse">
			<uni-collapse-item v-for="item in futuresList" :key="item.name">
				<template #title>
					<view class="collapse-title">
						<text>{{ item.chName }}</text>
						<text class="collapse-title-en">( {{item.name}} )</text>
					</view>
				</template>
				<view class="content">
					<view class="collapse-item">
						<view class="collapse-item-title">交易品种</view>
						<view>{{ item.chName }}</view>
					</view>
					<view class="collapse-item">
						<view class="collapse-item-title">交易代码</view>
						<view>{{ item.name }}</view>
					</view>
					<view class="collapse-item">
						<view class="collapse-item-title">每手每点位价格</view>
						<view>{{ item.num }} 元</view>
					</view>
					<view class="collapse-item">
						<view class="collapse-item-title">开仓手续费</view>
						<view>{{
							item.openCommissionType === 'number'
							? (Number(item.openCommission * commissionType) === 0 ? 0 : item.openCommission * commissionType + '元/手')
							: (item.openCommission * commissionType * 100 === 0 ? 0 : item.openCommission * commissionType * 100 + '%') }}
						</view>
					</view>
					<view class="collapse-item">
						<view class="collapse-item-title">平仓手续费</view>
						<view>{{
							item.closeCommissionType === 'number'
							? (Number(item.closeCommission * commissionType) === 0 ? 0 : item.closeCommission * commissionType + '元/手')
							: (item.closeCommission * commissionType * 100 === 0 ? 0 : item.closeCommission * commissionType * 100 + '%') }}
						</view>
					</view>
					<view class="collapse-item">
						<view class="collapse-item-title">日内平仓手续费</view>
						<view>{{
							item.closeCommissionType === 'number'
							? (Number(item.dayCloseCommission * commissionType) === 0 ? 0 : item.dayCloseCommission * commissionType + '元/手')
							: (item.dayCloseCommission * commissionType * 100 === 0 ? 0 : item.dayCloseCommission * commissionType * 100 + '%') }}
						</view>
					</view>
					<view class="collapse-item">
						<view class="collapse-item-title">是否支持优先平今</view>
						<view>{{ item.canCloseInDay ? '是' : '否' }}</view>
					</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script setup>
import { computed, ref, getCurrentInstance, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { updateUserInDayFirstLists } from '@/request.api/index.js'
import { onShareAppMessage } from '@dcloudio/uni-app'

const store = new useStore()

const futuresList = computed(() => store.getters['order/futuresList'])
const commissionType = computed(() => store.state.app.USER_INFO.commissionType || 4)

const openIndex = ref('0')

const drawImgUrl = ref('')

const draw = (data) => {
	return new Promise(resolve => {
		const lineGap = 47
		const context = uni.createCanvasContext('FutureInfo')
		const openCommission = data.openCommissionType === 'number'
			? (Number(data.openCommission * commissionType.value) === 0 ? 0 : data.openCommission * commissionType.value + '元/手')
			: (data.openCommission * commissionType.value * 100 === 0 ? 0 : data.openCommission * commissionType.value * 100 + '%')
		const closeCommission = data.closeCommissionType === 'number'
			? (Number(data.closeCommission * commissionType.value) === 0 ? 0 : data.closeCommission * commissionType.value + '元/手')
			: (data.closeCommission * commissionType.value * 100 === 0 ? 0 : data.closeCommission * commissionType.value * 100 + '%')
		const dayCloseCommission = data.closeCommissionType === 'number'
			? (Number(data.dayCloseCommission * commissionType.value) === 0 ? 0 : data.dayCloseCommission * commissionType.value + '元/手')
			: (data.dayCloseCommission * commissionType.value * 100 === 0 ? 0 : data.dayCloseCommission * commissionType.value * 100 + '%')
		context.setFontSize(20)
		drawLine('交易品种', `${data.chName} (${data.name})`, context, lineGap)
		drawLine('每手每点位价格', `${data.num}元`, context, lineGap * 2)
		drawLine('开仓手续费', openCommission, context, lineGap * 3)
		drawLine('平仓手续费', closeCommission, context, lineGap * 4)
		drawLine('日内平仓手续费', dayCloseCommission, context, lineGap * 5)
		drawLine('是否支持优先平今', data.canCloseInDay ? '是' : '否', context, lineGap * 6)
		context.draw(false, () => {
			resolve()
		})
	})
}

const drawLine = (label, value, context, y) => {
	context.setFillStyle('#a3a3a3')
	context.setTextAlign('left')
	context.fillText(label, 25, y, 395)
	context.stroke()
	context.setFillStyle('#222222')
	context.setTextAlign('right')
	context.fillText(value, 365, y, 395)
	context.stroke()
}

const createTempImg = () => {
	return new Promise(resolve => {
		uni.canvasToTempFilePath({
			canvasId: 'FutureInfo',
			success: (res) => {
				const fileSystemManager = uni.getFileSystemManager()
				fileSystemManager.saveFile({
					tempFilePath: res.tempFilePath,
					success: (saveRes) => {
						resolve({
							data: saveRes.savedFilePath,
							success: true,
							msg: '',
						})
					},
					fail: (e) => {
						resolve({
							data: '',
							success: false,
							msg: e,
						})
					},
				})
			},
			fail: (e) => {
				resolve({
					data: '',
					success: false,
					msg: e,
				})
			},
		})
	})
}

const canvasToImage = async (data) => {
	await draw(data)
	const res = await createTempImg()
	if (res.success) {
		drawImgUrl.value = res.data
	} else {
		ElMessage.success(res.msg)
	}
}

const changeCollapse = (value) => {
	if (value) {
		// #ifdef MP-WEIXIN
		canvasToImage(futuresList.value[value])
		// #endif
	}
}

onMounted(() => {
	if (futuresList.value[openIndex.value]) {
		// #ifdef MP-WEIXIN
		canvasToImage(futuresList.value[openIndex.value])
		// #endif
	}
})

watch(futuresList, (value) => {
	if (value) {
		// #ifdef MP-WEIXIN
		canvasToImage(futuresList.value[openIndex.value])
		// #endif
	}
})

onShareAppMessage(() => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const { route } = currentPage || {}
	const { proxy } = getCurrentInstance()

	if (futuresList.value[openIndex.value]) {
		proxy.setShareInfo({
			title: `${futuresList.value[openIndex.value].chName}品种简介`,
			imageUrl: drawImgUrl.value,
			path: route,
		})
	}
})

</script>

<style>
.introduction .uni-collapse-item__title-text {
	font-size: 16px;
}
</style>

<style scoped lang="scss">
.content {
	padding: 0 $page-padding;
}
.future-info {
	width: 395px;
	height: 316px;
	position: fixed;
	z-index: -99999;
	opacity: 0;
	visibility: hidden;
	left: -400px;
}
.collapse-title {
	padding: 0 15px;
	width: 100%;
	box-sizing: border-box;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	height: 48px;
	line-height: 48px;
	background-color: #fff;
	font-size: 15px;
	font-weight: bold;
	cursor: pointer;
	outline: none;
}
.collapse-title-en {
	font-size: 12px;
	color: #a3a3a3;
	margin-left: 4px;
}
.collapse-item {
	display: flex;
	margin-bottom: 12px;
	color: #222;
}
.collapse-item-title {
	color: #a3a3a3;
	width: 130px;
}
</style>
