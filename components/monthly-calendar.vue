<template>
    <div class="monthly-calendar">
		<view v-if="!insert && show" class="uni-calendar__mask" :class="{'uni-calendar--mask-show':aniMaskShow}" @click="clean"></view>
		<view v-if="insert || show" class="uni-calendar__content" :class="{'uni-calendar--fixed':!insert,'uni-calendar--ani-show':aniMaskShow}">
			<div class="monthly-calendar__header"><slot name="header"></slot></div>
			<div class="monthly-calendar__body">
			    <table class="monthly-calendar-table" cellspacing="0" cellpadding="0">
			        <tbody>
			            <tr class="el-calendar-table__row" v-for="item in monthArr" :key="item">
			                <td v-for="cell in item" :key="cell">
			                    <div class="el-calendar-day"
								 :class="`${activeDate}` === `${year_}-${monthMap[cell]}` ? 'active-day' : ''" @click="clickHandle({ month: monthMap[cell], label: cell, day: `${year_}-${monthMap[cell]}` })">
			                        <slot name="dateCell" 
			                            :data="{ month: monthMap[cell], label: cell, day: `${year_}-${monthMap[cell]}` }"
			                            :month="cell">
			                            <p class="inner-cell-p">{{ cell }}</p>
			                        </slot>
			                    </div>
			                </td>
			            </tr>
			        </tbody>
			    </table>
			</div>
        </view>
    </div>
</template>

<script>
import { computed, toRefs, ref, nextTick } from 'vue'

export default {
    name: 'monthly-calendar',
    props: {
        year: {
            default: '1970',
            type: String,
        },
		activeDate: {
            default: '',
            type: String,
		},
		insert: {
			type: Boolean,
			default: true,
		},
		showNumber: {
			type: Boolean,
			default: false,
		},
    },
    setup(props, { emit }) {
        const { year } = toRefs(props)
		
		const show = ref(false)
		const aniMaskShow = ref(false)

        const monthArr = props.showNumber ? [
            ['1月', '2月', '3月', '4月'],
            ['5月', '6月', '7月', '8月'],
            ['9月', '10月', '11月', '12月'],
        ] : [
			['一月', '二月', '三月', '四月'],
			['五月', '六月', '七月', '八月'],
			['九月', '十月', '十一月', '十二月'],
		]

        const monthMap = {
            '一月': '01',
            '二月': '02',
            '三月': '03',
            '四月': '04',
            '五月': '05',
            '六月': '06',
            '七月': '07',
            '八月': '08',
            '九月': '09',
            '十月': '10',
            '十一月': '11',
            '十二月': '12',
            '1月': '01',
            '2月': '02',
            '3月': '03',
            '4月': '04',
            '5月': '05',
            '6月': '06',
            '7月': '07',
            '8月': '08',
            '9月': '09',
            '10月': '10',
            '11月': '11',
            '12月': '12',
        }

        const clickHandle = (value) => {
            emit('on-click', value)
        }

        const year_ = computed(() => year.value.slice(0, 4))
		
		const open = () => {
			show.value = true
			nextTick(() => {
				setTimeout(() => {
					aniMaskShow.value = true
				}, 50)
			})
		}
		
		const close = () => {
			aniMaskShow.value = false
			nextTick(() => {
				setTimeout(() => {
					show.value = false
					emit('close')
				}, 300)
			})
		}
		
		const clean = () => {
			close()
		}
		
		const clearCalender = () => {
			
		}

        return {
            year_,
            monthMap,
            monthArr,
            clickHandle,
			show,
			aniMaskShow,
			open,
			close,
			clean,
			clearCalender,
        }
    },
}
</script>

<style scoped lang="scss">
.monthly-calendar  {
    margin: 0 -6px;
}
.monthly-calendar-table {
    table-layout: fixed;
    width: 100%;
}
.monthly-calendar__header {
    display: flex;
    justify-content: space-between;
    margin: 0 6px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
}
.monthly-calendar-table td {
    vertical-align: top;
    padding: 0 6px;
    box-sizing: border-box;
}
.monthly-calendar-table .el-calendar-day {
    box-sizing: border-box;
    padding: 0;
    height: 60px;
    font-size: 16px;
    text-align: center;
    color: #222;
    cursor: pointer;
    margin-bottom: 12px;
}
.monthly-calendar-table .el-calendar-day p:first-of-type {
    padding: 8px;
}
.monthly-calendar__body {
    padding-top: 20px;
}
.monthly-calendar-table .active-day {
	background-color: #2979ff;
	color: white;
}

.uni-calendar__content {
	background-color: #fff;
}
.uni-calendar__mask {
	position: fixed;
	bottom: 0;
	top: 0;
	left: 0;
	right: 0;
	background-color: $mask-color;
	transition-property: opacity;
	transition-duration: 0.3s;
	opacity: 0;
	/* #ifndef APP-NVUE */
	z-index: 99;
	/* #endif */
}
.uni-calendar--fixed {
	position: fixed;
	/* #ifdef APP-NVUE */
	bottom: 0;
	/* #endif */
	left: 0;
	right: 0;
	transition-property: transform;
	transition-duration: 0.3s;
	transform: translateY(460px);
	/* #ifndef APP-NVUE */
	bottom: calc(var(--window-bottom));
	z-index: 99;
	/* #endif */
}
.inner-cell-p {
	height: 44px;
	line-height: 44px;
}
.uni-calendar--ani-show {
	transform: translateY(0);
}
.uni-calendar--mask-show {
	opacity: 1
}
</style>
