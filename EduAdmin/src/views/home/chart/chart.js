import * as echarts from "echarts";
import React, { useEffect, useRef } from "react";


export default function Chart({option,height="400px"}) {
  const chart = useRef(null);
  useEffect(() => {
    const myChart = echarts.init(chart.current);
    myChart.setOption(option||{});
    window.addEventListener("resize", () => {
      myChart.resize();
    });
    return () => {
      myChart.dispose();
    };
  }, [option]);
  return (
    <div id="chart" ref={chart} style={{ width: "90%", height: height }}></div>
  );
}
