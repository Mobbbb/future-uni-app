"use strict";
const getOrderLineOption = (data) => {
  return {
    tooltip: {
      trigger: "axis",
      formatter: `{c}`
    },
    grid: {
      top: 10,
      bottom: 10,
      left: 0,
      right: 10,
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: data.x,
      interval: 0,
      axisPointer: {
        show: true,
        type: "line",
        lineStyle: {
          color: "#222",
          type: "solid"
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: "#d0d0d0",
          width: 1
        }
      },
      axisLabel: {
        textStyle: {
          color: "#8e8e8e",
          fontSize: 10
        }
      }
    },
    yAxis: {
      type: "value",
      min: Math.round(Math.min(...data.y) * 0.95 / 100) * 100,
      max: Math.ceil(Math.max(...data.y) * 1.05 / 100) * 100,
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#f1f3f8",
          type: "dashed"
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#d0d0d0",
          width: 1
        }
      },
      axisPointer: {
        show: true,
        type: "line",
        lineStyle: {
          color: "#222",
          type: "solid"
        }
      },
      axisLabel: {
        show: true,
        // *$修改 axisTick 颜色
        textStyle: {
          color: (value) => {
            return value !== "0" ? "#8e8e8e" : "rgba(0, 0, 0, 0)";
          },
          fontSize: 10
        }
      }
    },
    series: [
      {
        data: data.y,
        type: "line",
        itemStyle: {
          color: "#ef97b2"
        },
        label: {
          show: true,
          fontSize: 8
        },
        animation: true,
        animationDuration: 300
      }
    ]
  };
};
exports.getOrderLineOption = getOrderLineOption;
