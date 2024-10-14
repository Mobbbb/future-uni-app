<template>
	<view class="ux-pull">
		<view
		    id="pull-container"
			:data-disabled="disabled"
			:data-is-ios="isIos"
			:data-scroll-top="scrollTop"
			:change:prop="wxsPullLoading.propObserver"
			:prop="loadEndStatus"
		    @touchstart="wxsPullLoading.handlerStart"
		    @touchmove="wxsPullLoading.handlerMove"
		    @touchend="wxsPullLoading.handlerEnd">
			<view class="ios-pull-header" v-if="isIos">
				<view class="ios-block"></view>
				<view class="ios-points-wrap">
					<view class="ios-pull-point ios-left-point flicker"></view>
					<view class="ios-pull-point flicker"></view>
					<view class="ios-pull-point ios-right-point flicker"></view>
				</view>
			</view>
			<view class="pull-head" v-else>
				<view class="points-wrap">
					<view class="pull-point left-point"></view>
					<view class="pull-point"></view>
					<view class="pull-point right-point"></view>
				</view>
			</view>
		    <view class="pull-body">
				<slot></slot>
		    </view>
		</view>
	</view>
</template>

<script module="wxsPullLoading" lang="wxs">
	var pullInfo = {
		startY: 0,
		deltaY: 0,
		slowY: 0,
	}
	var scrollTop = 0
	var isIos = false
	var disabled = false

	var lock = false
	var isPull = null

	var maxSlideDis = 800
	var maxMoveDis = maxSlideDis * 0.15
	var refreshDis = maxSlideDis * 0.06

	var maxPointSlideDis = 60
	var maxPointMoveDis = maxPointSlideDis * 0.25

	function handlerStart(e, ins) {
		if (lock) return
		isPull = null
		pullInfo.startY = e.touches[0].pageY
		pullInfo.deltaY = 0
		pullInfo.slowY = 0
		var dataset = ins.selectComponent('#pull-container').getDataset()
		scrollTop = dataset.scrollTop || 0
		isIos = dataset.isIos || false
		disabled = dataset.disabled || false
	}
	function handlerMove(e, ins) {
		if (!lock && scrollTop <= 0 && !isIos && !disabled) {
			pullInfo.deltaY = e.touches[0].pageY - pullInfo.startY
			if (typeof isPull !== 'boolean') {
				isPull = pullInfo.deltaY > 0
			}

			if (pullInfo.deltaY > 0 && isPull) { // 开始拖拽
				var t = pullInfo.deltaY / maxSlideDis
				if (t >= 1) {
					pullInfo.slowY = maxMoveDis
				} else {
					pullInfo.slowY = parseInt((3 * Math.pow(t, 2 / 3) - 2 * t) * maxMoveDis)
				}

				var t1 = pullInfo.deltaY / maxPointSlideDis
				var pointGap = 0
				if (t1 >= 1) {
					pointGap = maxPointMoveDis
				} else {
					pointGap = parseInt((0.3475 * t1 - 0.6029 * t1 * t1 + 0.9827 * t1 * t1 * t1) * maxPointMoveDis)
				}

				setPointMargin(ins, pointGap)
				ins.selectComponent('#pull-container').setStyle({ transform: 'translateY(' + pullInfo.slowY + 'px)' })

				// 阻止默认事件和冒泡，否则安卓会有触发频率限制
				return false
			}
		}
	}
	function handlerEnd(e, ins) {
		if (lock || disabled) return

		if (!isIos) {
			if (pullInfo.slowY > refreshDis) {
				lock = true
				ins.selectComponent('#pull-container').setStyle({
					transform: 'translateY(' + refreshDis + 'px)',
					transition: 'transform .3s ease',
				})
				flickerPoints(ins)
				setPointMargin(ins, maxPointMoveDis)
				ins.callMethod('pullEnd')
			} else if (pullInfo.slowY > 1) {
				ins.selectComponent('#pull-container').setStyle({
					transform: 'translateY(0)',
					transition: 'transform .3s ease',
				})
				ins.setTimeout(function() {
					ins.selectComponent('#pull-container').setStyle({}) // 移除transform属性，否则会使子元素的position: fixed失效
				}, 300)
			}
		} else {
			scrollTop = ins.selectComponent('#pull-container').getDataset().scrollTop || 0
			if (scrollTop < (- refreshDis)) {
				lock = true
				ins.selectComponent('.ios-block').setStyle({ height: refreshDis + 'px' })

				ins.setTimeout(function() {
					ins.callMethod('pullEnd')
				}, 300)
			}
		}
		pullInfo.deltaY = 0
		pullInfo.slowY = 0
		isPull = null
	}
	
	function reset(ins) {
		if (!isIos) {
			stopPoints(ins)
			setPointMargin(ins, 0)
			ins.selectComponent('#pull-container').setStyle({
				transform: 'translateY(0)',
				transition: 'transform .3s ease',
			})
			ins.setTimeout(function() {
				ins.selectComponent('#pull-container').setStyle({}) // 移除transform属性，否则会使子元素的position: fixed失效
				lock = false
			}, 300)
		} else {
			ins.setTimeout(function() {
				ins.selectComponent('.ios-block').setStyle({ height: '0' })
				lock = false
			}, 600)
		}
	}
	
	function setPointMargin(ins, margin) {
		var leftPoint = ins.selectComponent('.left-point')
		var rightPoint = ins.selectComponent('.right-point')
		if (leftPoint) {
			leftPoint.setStyle({ left: '-' + margin + 'px' })
		}
		if (rightPoint) {
			rightPoint.setStyle({ right: '-' + margin + 'px' })
		}
	}
	
	function flickerPoints(ins) {
		var points = ins.selectAllComponents('.pull-point')
		for (var i = 0; i < points.length; i++) {
			points[i].addClass('flicker')
		}
	}
	
	function stopPoints(ins) {
		var points = ins.selectAllComponents('.pull-point')
		for (var i = 0; i < points.length; i++) {
			points[i].removeClass('flicker')
		}
	}

	module.exports = {
		handlerStart: handlerStart,
		handlerMove: handlerMove,
		handlerEnd: handlerEnd,
		propObserver: function(newValue, oldValue, ownerInstance, ins) {
			reset(ownerInstance)
		},
	}
</script>

<script>
export default {
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		scrollTop: {
			type: Number,
			default: 0,
		},
		height: {
			type: String,
			default: '100%',
		},
	},
	data() {
		const systemInfo = uni.getSystemInfoSync()

		return {
			loadEndStatus: false,
			isIos: systemInfo.osName === 'ios' || systemInfo.osName === 'macos',
			scrollAble: true,
		}
	},
	methods: {
		pullEnd() {
			this.$emit('on-pull-end', this.changeLoadEndStatus)
		},
		changeLoadEndStatus() {
			this.loadEndStatus = !this.loadEndStatus
		},
		changeScrollAble({ status }) {
			this.scrollAble = status
		},
	},
}
</script>

<style lang="scss" scoped>
#pull-container {
	position: relative;
	width: 100%;
	height: 100%;
}
.pull-head {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 6px;
	display: flex;
	justify-content: center;
	transform: translateY(-100%);
	padding-bottom: 21px;
	z-index: 10;
}
.points-wrap {
	width: 6px;
	height: 6px;
	position: relative;
}
.pull-point, .ios-pull-point {
	width: 6px;
	height: 6px;
	border-radius: 6px;
	background-color: rgba(0, 0, 0, 0.3);
	position: absolute;
}
.ios-pull-header {
	margin-top: -21px;
}
.ios-points-wrap {
	width: 6px;
	height: 6px;
	margin: 0 auto;
	position: relative;
	display: flex;
	align-items: flex-end;
	box-sizing: border-box;
	padding-bottom: 21px;
}
.ios-left-point {
	left: -15px;
}
.ios-right-point {
	right: -15px;
}
.ios-block {
	width: 100%;
	height: 0;
	transition: height .3s ease;
}

.flicker:nth-of-type(1) {
	animation: 1s flicker1 infinite;
}
.flicker:nth-of-type(2) {
	animation: 1s flicker2 infinite;
}
.flicker:nth-of-type(3) {
	animation: 1s flicker3 infinite;
}

@keyframes flicker1 {
	0% {
		background-color: rgba(0, 0, 0, 0.3);
	}
	30% {
		background-color: rgba(0, 0, 0, 0.8);
	}
	60% {
		background-color: rgba(0, 0, 0, 0.3);
	}
	100% {
		background-color: rgba(0, 0, 0, 0.3);
	}
}

@keyframes flicker2 {
	0% {
		background-color: rgba(0, 0, 0, 0.3);
	}
	33% {
		background-color: rgba(0, 0, 0, 0.3);
	}
	66% {
		background-color: rgba(0, 0, 0, 0.8);
	}
	100% {
		background-color: rgba(0, 0, 0, 0.3);
	}
}

@keyframes flicker3 {
	0% {
		background-color: rgba(0, 0, 0, 0.3);
	}
	33% {
		background-color: rgba(0, 0, 0, 0.3);
	}
	66% {
		background-color: rgba(0, 0, 0, 0.3);
	}
	100% {
		background-color: rgba(0, 0, 0, 0.8);
	}
}
</style>
