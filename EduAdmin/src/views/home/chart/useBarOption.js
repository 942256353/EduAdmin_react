let years = [];
let studentCount = [];
export default function (data) {
  data.length>0&&(years = data.map((item) => item.month));
  data.length>0&&(studentCount = data.map((item) => item.count));
  const option = {
    backgroundColor: "#fff", // 图表背景颜色
    grid: {
      top: "10%",
      left: "2%",
      right: "2%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: years,
      axisLabel: {
        color: "#000", // X轴标签颜色
        fontSize: 14,
        fontWeight: "bold",
      },
      axisLine: {
        lineStyle: {
          color: "#fff", // 隐藏X轴线
        },
      },
      axisTick: {
        show: false, // 隐藏刻度线
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#000", // Y轴标签颜色
        fontSize: 14,
        fontWeight: "bold",
      },
      axisLine: {
        lineStyle: {
          color: "#000", // 隐藏Y轴线
        },
      },
      axisTick: {
        show: false, // 隐藏刻度线
      },
      //   splitLine: {
      //     show: true  // 隐藏分隔线
      //   }
    },
    series: [
      {
        type: "bar",
        data: studentCount,
        // barWidth: 10,
        // barGap: '2%', // 柱状图间隙为10%
        label: {
          show: true,
          position: "top",
          color: "#000", // 标签文字颜色
          fontSize: 14,
          fontWeight: "bold",
        },
        itemStyle: {
          color: "#83aaf0", // 柱子的颜色
        },
      },
    ],
  };
  return option;
}
