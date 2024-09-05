<template>
	<view class="uni-date">
		<view class="uni-date-editor">
			<slot>
				<view class="uni-date-editor--x"
					:class="{'uni-date-editor--x__disabled': disabled,'uni-date-x--border': border}">
					<view class="uni-date-x uni-date-single">
						<uni-icons class="icon-calendar" type="calendar" color="#c0c4cc" size="22"></uni-icons>
						<view class="picker-wrap">
							<picker mode="selector" :value="currentYearIndex" :range="defaultYearRange" @change="changeYear">
								<view class="uni-date__x-input">{{ paneYear }} 年</view>
							</picker>
						</view>
					</view>

					<view v-if="showClearIcon" class="uni-date__icon-clear" @click.stop="clear">
						<uni-icons type="clear" color="#c0c4cc" size="22"></uni-icons>
					</view>
				</view>
			</slot>
		</view>
		
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
	 * @event {Function} clear 清除上次选中的状态和值
	 **/
	import { dateFormat } from './util.js'

	export default {
		name: 'UxYearPicker',

		options: {
			// #ifdef MP-TOUTIAO
			virtualHost: false,
			// #endif
			// #ifndef MP-TOUTIAO
			virtualHost: true
			// #endif
		},
		data() {
			const currentYear = Number(dateFormat(Date.now(), 'yyyy'))
			const arr = Array.from(Array(60), (item, index) => currentYear + 10 - index)

			return {
				currentYearIndex: arr.indexOf(currentYear),
				defaultYearRange: Array.from(Array(60), (item, index) => currentYear + 10 - index),
				isEmitValue: false,
				paneYear: '',
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
				return this.clearIcon && !this.disabled && this.paneYear
			},
		},
		mounted() {
			if (this.yearRange.length) {
				this.defaultYearRange = this.yearRange
			}
		},
		methods: {
			changeYear(date) {
				this.paneYear = this.defaultYearRange[date.detail.value].toString()
				this.$emit('input', this.paneYear)
				this.$emit('update:modelValue', this.paneYear)
				this.$emit('change', this.paneYear)
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
						this.paneYear = newVal.toString()
						this.currentYearIndex = this.defaultYearRange.indexOf(Number(this.paneYear))
					}
				}
			},
			clear(needEmit = true) {
				this.paneYear = ''
				if (needEmit) {
					this.$emit('input', '')
					this.$emit('update:modelValue', '')
					this.$emit('change', '')
				}
			},
		}
	}
</script>

<style lang="scss">
	$uni-primary: #007aff !default;

	.uni-date {
		width: 100%;
		flex: 1;
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
	.picker-wrap {
		width: 100%;
	}
</style>
