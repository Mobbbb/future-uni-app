export const getLineOption = (data) => {
    return {
		legend: {
			show: true,
			top: 10,
			left: 'center',
			data: ['92', '95', '98']
		},
        tooltip: {
            trigger: 'axis',
            formatter: `{b}\n98#: {c2} 元/升\n95#: {c1} 元/升\n92#: {c} 元/升`,
			backgroundColor: 'rgba(0, 0, 0, 0.7)',
			textStyle: {
				color: 'white',
			},
        },
        grid: {
            top: 40,
            bottom: 10,
            left: 24,
            right: 12,
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: data.x,
            interval: 0,
            axisPointer: {
                show: true,
                type: 'line',
                lineStyle: {
                    color: '#222',
                    type: 'solid',
                },
            },
            axisTick: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    color: '#d0d0d0',
                    width: 1,
                },
            },
            axisLabel: {
				color: '#8e8e8e',
				fontSize: 10,
            },
        },
        yAxis: {
            type: 'value',
			max: Math.ceil(Math.max(...data.y98)),
			min: Math.floor(Math.min(...data.y92)),
            axisTick: {
                show: false,
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#f1f3f8',
                    type: 'dashed',
                },
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#d0d0d0',
                    width: 1,
                },
            },
            axisPointer: {
                show: false,
                type: 'line',
                lineStyle: {
                    color: '#222',
                    type: 'solid',
                },
            },
            axisLabel: {
                show: true,
                // *$修改 axisTick 颜色
				color: (value) => {
					// *$隐藏0坐标
					return value !== '0' ? '#8e8e8e' : 'rgba(0, 0, 0, 0)'
				},
				fontSize: 10,
            },
        },
        series: [
            {
				name: '92',
                data: data.y92,
                type: 'line',
                itemStyle: {
                    color: '#409eff',
                },
                label: {
                    show: true,
                    fontSize: 8,
					position: 'bottom',
                },
                animation: true,
                animationDuration: 300,
				smooth: true,
            },
            {
				name: '95',
                data: data.y95,
                type: 'line',
                itemStyle: {
                    color: '#7dcf15',
                },
                label: {
                    show: true,
                    fontSize: 8,
					position: 'top',
                },
                animation: true,
                animationDuration: 300,
				smooth: true,
            },
            {
				name: '98',
                data: data.y98,
                type: 'line',
                itemStyle: {
                    color: '#e64f42',
                },
                label: {
                    show: true,
                    fontSize: 8,
					position: 'bottom',
                },
                animation: true,
                animationDuration: 300,
				smooth: true,
            },
        ]
    }
}
