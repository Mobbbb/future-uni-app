<template>
	<view>
		<view
		    id="pull-container"
			:data-is-ios="isIos"
			:data-scroll-top="scrollTop"
			:change:prop="wxsPullLoading.propObserver"
			:prop="loadEndStatus"
		    @touchstart="wxsPullLoading.handlerStart"
		    @touchmove="wxsPullLoading.handlerMove"
		    @touchend="wxsPullLoading.handlerEnd">
		    <view class="pull-head">
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
		prevY: 0,
		startY: 0,
		deltaY: 0,
		slowY: 0,
	}
	var lock = false
	var scrollTop = 0
	var prevScrollTop = 0
	var count = 0
	var isIos = false

	var maxSlideDis = 800
	var maxMoveDis = maxSlideDis * 0.15
	var refreshDis = maxSlideDis * 0.06

	var maxPointSlideDis = 60
	var maxPointMoveDis = maxPointSlideDis * 0.25

	function handlerStart(e, ins) {
		if (lock) return
		pullInfo.startY = 0
		pullInfo.deltaY = 0
		pullInfo.slowY = 0
		pullInfo.prevY = parseInt(e.touches[0].pageY)
		var dataset = ins.selectComponent('#pull-container').getDataset()
		scrollTop = dataset.scrollTop || 0
		prevScrollTop = dataset.scrollTop || 0
		isIos = dataset.isIos || false
	}
	function handlerMove(e, ins) {
		if (isIos) {
			var isDown = parseInt(e.touches[0].pageY) - pullInfo.prevY > 0
			if (!lock && pullInfo.deltaY <= 1) {
				scrollTop = ins.selectComponent('#pull-container').getDataset().scrollTop || 0
			}
			if (isDown) {
				if (prevScrollTop === scrollTop) {
					count ++
				} else {
					count = 0
				}
			}
		}

		if (!lock && (scrollTop <= 1 || (scrollTop > 1 && count > 6))) {
			if (!pullInfo.startY) pullInfo.startY = e.touches[0].pageY
			pullInfo.deltaY = e.touches[0].pageY - pullInfo.startY

			if (pullInfo.deltaY > 0) { // 开始拖拽
				if (isIos) {
					ins.callMethod('changeScrollAble', { status: false })
				}
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
		if (isIos) {
			pullInfo.prevY = parseInt(e.touches[0].pageY)
			prevScrollTop = scrollTop
		}
	}
	function handlerEnd(e, ins) {
		if (lock) return

		if (pullInfo.slowY > refreshDis) {
			lock = true
			ins.selectComponent('#pull-container').setStyle({
				transform: 'translateY(' + refreshDis + 'px)',
				transition: 'transform .3s ease',
			})
			flickerPoints(ins)
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
		count = 0
		pullInfo.deltaY = 0
		pullInfo.slowY = 0

		if (isIos) {
			ins.callMethod('changeScrollAble', { status: true })
		}
	}
	
	function reset(ins) {
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
	}
	
	function setPointMargin(ins, margin) {
		ins.selectComponent('.left-point').setStyle({ left: '-' + margin + 'px' })
		ins.selectComponent('.right-point').setStyle({ right: '-' + margin + 'px' })
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
const systemInfo = uni.getSystemInfoSync()

export default {
	props: {
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
}
.points-wrap {
	width: 6px;
	height: 6px;
	position: relative;
}
.pull-point {
	width: 6px;
	height: 6px;
	border-radius: 6px;
	background-color: rgba(0, 0, 0, 0.3);
	position: absolute;
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
