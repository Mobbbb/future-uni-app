<template>
	<view class="uni-date">
		<view class="uni-date-editor" @click="show">
			<slot>
				<view class="uni-date-editor--x"
					:class="{'uni-date-editor--x__disabled': disabled,'uni-date-x--border': border}">
					<view class="uni-date-x uni-date-single">
						<uni-icons class="icon-calendar" type="calendar" color="#c0c4cc" size="22"></uni-icons>
						<view class="uni-date__x-input">{{ displayValue || singlePlaceholderText }}</view>
					</view>

					<view v-if="showClearIcon" class="uni-date__icon-clear" @click.stop="clear">
						<uni-icons type="clear" color="#c0c4cc" size="22"></uni-icons>
					</view>
				</view>
			</slot>
		</view>

		<Calendar @close="closeHandle" ref="mobile" :insert="false" :active-date="displayValue" :year="paneYear" :showNumber="true" @on-click="calendarClick">
			<template #header>
				<view class="uni-calendar__header uni-calendar__header-mobile">
					<view class="uni-calendar__header-btn-box" @click.stop="changeYearByStep(-1)">
						<view class="uni-calendar__header-btn uni-calendar--left"></view>
					</view>
				
					<picker mode="selector" :value="currentYearIndex" :range="defaultYearRange" @change="changeYear">
						<text class="uni-calendar__header-text">{{ paneYear }} 年</text>
					</picker>
				
					<view class="uni-calendar__header-btn-box" @click.stop="changeYearByStep(1)">
						<view class="uni-calendar__header-btn uni-calendar--right"></view>
					</view>
				
					<view class="dialog-close" @click="maskClick">
						<view class="dialog-close-plus"></view>
						<view class="dialog-close-plus dialog-close-rotate"></view>
					</view>
				</view>
			</template>
		</Calendar>
	</view>
</template>
<script>
	/**
	 * DatetimePicker 时间选择器
	 * @description 同时支持 PC 和移动端使用日历选择日期和日期范围
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=3962
	 * @property {String} type 选择器类型
	 * @property {String|Number|Array|Date} value 绑定值
	 * @property {String} placeholder 单选择时的占位内容
	 * @property {String} start 起始时间
	 * @property {String} end 终止时间
	 * @property {Boolean} border = [true|false] 是否有边框
	 * @property {Boolean} disabled = [true|false] 是否禁用
	 * @property {Boolean} clearIcon = [true|false] 是否显示清除按钮（仅PC端适用）
	 * @event {Function} change 确定日期时触发的事件
	 * @event {Function} maskClick 点击遮罩层触发的事件
	 * @event {Function} show 打开弹出层
	 * @event {Function} close 关闭弹出层
	 * @event {Function} clear 清除上次选中的状态和值
	 **/
	import Calendar from '../monthly-calendar.vue'
	import { dateFormat } from './util.js'

	export default {
		name: 'UxMonthPicker',

		options: {
			// #ifdef MP-TOUTIAO
			virtualHost: false,
			// #endif
			// #ifndef MP-TOUTIAO
			virtualHost: true
			// #endif
		},
		components: {
			Calendar,
		},
		data() {
			const currentYear = Number(dateFormat(Date.now(), 'yyyy'))
			const arr = Array.from(Array(60), (item, index) => currentYear + 10 - index)

			return {
				currentYearIndex: arr.indexOf(currentYear),
				defaultYearRange: Array.from(Array(60), (item, index) => currentYear + 10 - index),
				displayValue: '',
				inputDate: '',
				pickerTime: '',
				isEmitValue: false,
				paneYear: '',
				selectedDate: '',
			}
		},
		props: {
			yearRange: {
				type: Array,
				default: [],
			},
			value: {
				type: [String, Number, Array, Date],
				default: ''
			},
			modelValue: {
				type: [String, Number, Array, Date],
				default: ''
			},
			placeholder: {
				type: String,
				default: ''
			},
			border: {
				type: [Boolean],
				default: true
			},
			disabled: {
				type: [Boolean],
				default: false
			},
			clearIcon: {
				type: [Boolean],
				default: true
			},
		},
		watch: {
			// #ifndef VUE3
			value: {
				immediate: true,
				handler(newVal) {
					if (this.isEmitValue) {
						this.isEmitValue = false
						return
					}
					this.initPicker(newVal)
				}
			},
			// #endif
			// #ifdef VUE3
			modelValue: {
				immediate: true,
				handler(newVal) {
					if (this.isEmitValue) {
						this.isEmitValue = false
						return
					}
					this.initPicker(newVal)
				}
			},
			// #endif
		},
		computed: {
			datePopupWidth() {
				// todo
				return 301
			},

			/**
			 * for i18n
			 */
			singlePlaceholderText() {
				return this.placeholder || '请选择'
			},
			showClearIcon() {
				return this.clearIcon && !this.disabled && this.displayValue
			},
		},
		mounted() {
			if (this.yearRange.length) {
				this.defaultYearRange = this.yearRange
			}
		},
		methods: {
			maskClick() {
				this.close()
			},
			changeYear(date) {
				this.paneYear = this.defaultYearRange[date.detail.value].toString()
			},
			changeYearByStep(step) {
				const res = step + Number(this.paneYear)
				if (this.defaultYearRange.includes(res)) {
					this.paneYear = res.toString()
				}
			},
			initPicker(newVal) {
				if (!newVal || Array.isArray(newVal) && !newVal.length) {
					this.$nextTick(() => {
						this.clear(false)
					})
					return
				}

				if (!Array.isArray(newVal)) {
					if (newVal) {
						this.displayValue = this.inputDate = dateFormat(newVal, 'yyyy-MM')
						this.paneYear = this.displayValue.slice(0, 4)
					}
				}
			},
			show() {
				this.$emit("on-show")
				if (this.disabled) {
					return
				}
				setTimeout(() => {
					this.$refs.mobile.open()
				}, 0)
			},
			close() {
				setTimeout(() => {
					this.$emit('maskClick', this.value)
					this.$refs.mobile && this.$refs.mobile.close()
				}, 20)
			},
			closeHandle() {
				this.$emit('on-close')
			},
			clear(needEmit = true) {
				this.displayValue = ''
				this.inputDate = ''
				this.pickerTime = ''
				this.$refs.mobile && this.$refs.mobile.clearCalender()
				if (needEmit) {
					this.$emit('change', '')
					this.$emit('input', '')
					this.$emit('update:modelValue', '')
				}
			},

			calendarClick(e) {
				this.$emit('update:modelValue', e.day)
				this.$emit('change', e.day)
				this.close()
			}
		}
	}
</script>

<style lang="scss">
	$uni-primary: #007aff !default;

	.uni-date {
		/* #ifndef MP-WEIXIN */
		flex: 1;
		/* #endif */
		width: 100%;
	}

	.uni-date-x {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		background-color: #fff;
		color: #666;
		font-size: 14px;
		flex: 1;

		.icon-calendar {
			padding-left: 3px;
		}

		.range-separator {
			height: 35px;
			/* #ifndef MP */
			padding: 0 2px;
			/* #endif */
			line-height: 35px;
		}
	}

	.uni-date-x--border {
		box-sizing: border-box;
		border-radius: 4px;
		border: 1px solid #e5e5e5;
	}

	.uni-date-editor--x {
		display: flex;
		align-items: center;
		position: relative;
	}

	.uni-date-editor--x .uni-date__icon-clear {
		padding-right: 3px;
		display: flex;
		align-items: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.uni-date__x-input {
		width: auto;
		height: 35px;
		/* #ifndef MP */
		padding-left: 5px;
		/* #endif */
		position: relative;
		flex: 1;
		line-height: 35px;
		font-size: 14px;
		overflow: hidden;
	}

	.text-center {
		text-align: center;
	}

	.uni-date__input {
		height: 40px;
		width: 100%;
		line-height: 40px;
		font-size: 14px;
	}

	.uni-date-range__input {
		text-align: center;
		max-width: 142px;
	}

	.uni-date-picker__container {
		position: relative;
	}

	.uni-date-mask--pc {
		position: fixed;
		bottom: 0px;
		top: 0px;
		left: 0px;
		right: 0px;
		background-color: rgba(0, 0, 0, 0);
		transition-duration: 0.3s;
		z-index: 996;
	}

	.uni-date-single--x {
		background-color: #fff;
		position: absolute;
		top: 0;
		z-index: 999;
		border: 1px solid #EBEEF5;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		border-radius: 4px;
	}

	.uni-date-range--x {
		background-color: #fff;
		position: absolute;
		top: 0;
		z-index: 999;
		border: 1px solid #EBEEF5;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		border-radius: 4px;
	}

	.uni-date-editor--x__disabled {
		opacity: 0.4;
		cursor: default;
	}

	.uni-date-editor--logo {
		width: 16px;
		height: 16px;
		vertical-align: middle;
	}

	/* 添加时间 */
	.popup-x-header {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.popup-x-header--datetime {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex: 1;
	}

	.popup-x-body {
		display: flex;
	}

	.popup-x-footer {
		padding: 0 15px;
		border-top-color: #F1F1F1;
		border-top-style: solid;
		border-top-width: 1px;
		line-height: 40px;
		text-align: right;
		color: #666;
	}

	.popup-x-footer text:hover {
		color: $uni-primary;
		cursor: pointer;
		opacity: 0.8;
	}

	.popup-x-footer .confirm-text {
		margin-left: 20px;
		color: $uni-primary;
	}

	.uni-date-changed {
		text-align: center;
		color: #333;
		border-bottom-color: #F1F1F1;
		border-bottom-style: solid;
		border-bottom-width: 1px;
	}

	.uni-date-changed--time text {
		height: 50px;
		line-height: 50px;
	}

	.uni-date-changed .uni-date-changed--time {
		flex: 1;
	}

	.uni-date-changed--time-date {
		color: #333;
		opacity: 0.6;
	}

	.mr-50 {
		margin-right: 50px;
	}

	.uni-popper__arrow,
	.uni-popper__arrow::after {
		position: absolute;
		display: block;
		width: 0;
		height: 0;
		border: 6px solid transparent;
		border-top-width: 0;
	}

	.uni-popper__arrow {
		filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
		top: -6px;
		left: 10%;
		margin-right: 3px;
		border-bottom-color: #EBEEF5;
	}

	.uni-popper__arrow::after {
		content: " ";
		top: 1px;
		margin-left: -6px;
		border-bottom-color: #fff;
	}
	
	.uni-calendar__header {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 50px;
	}

	.uni-calendar__header-mobile {
		width: 100%;
		padding: 10px;
		padding-bottom: 0;
	}

	.uni-calendar--fixed-top {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		border-top-color: rgba(0, 0, 0, 0.4);
		border-top-style: solid;
		border-top-width: 1px;
	}

	.uni-calendar--fixed-width {
		width: 50px;
	}

	.uni-calendar__backtoday {
		position: absolute;
		right: 0;
		top: 25rpx;
		padding: 0 5px;
		padding-left: 10px;
		height: 25px;
		line-height: 25px;
		font-size: 12px;
		border-top-left-radius: 25px;
		border-bottom-left-radius: 25px;
		color: #fff;
		background-color: #f1f1f1;
	}

	.uni-calendar__header-text {
		text-align: center;
		width: 100px;
		font-size: 15px;
		color: #666;
	}

	.uni-calendar__button-text {
		text-align: center;
		width: 100px;
		font-size: 14px;
		color: $uni-primary;
		/* #ifndef APP-NVUE */
		letter-spacing: 3px;
		/* #endif */
	}

	.uni-calendar__header-btn-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
	}

	.uni-calendar__header-btn {
		width: 9px;
		height: 9px;
		border-left-color: #808080;
		border-left-style: solid;
		border-left-width: 1px;
		border-top-color: #555555;
		border-top-style: solid;
		border-top-width: 1px;
	}
	.dialog-close {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		padding: 0 25px;
		margin-top: 10px;
	}

	.dialog-close-plus {
		width: 16px;
		height: 2px;
		background-color: #737987;
		border-radius: 2px;
		transform: rotate(45deg);
	}

	.dialog-close-rotate {
		position: absolute;
		transform: rotate(-45deg);
	}

	.uni-calendar--left {
		transform: rotate(-45deg);
	}

	.uni-calendar--right {
		transform: rotate(135deg);
	}
</style>
