
export default function (data) {
  const option = {
    title: {
      text: "各类别数量及占比",
      left: "center",
    },
    //   tooltip: {
    //     trigger: "item",
    //   },
    tooltip: {
      formatter: "{b}: {c} ({d}%)", // 显示名称、值和百分比
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        type: "pie",
        // radius: '60%', // 调整饼图的半径
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  return option;
}
