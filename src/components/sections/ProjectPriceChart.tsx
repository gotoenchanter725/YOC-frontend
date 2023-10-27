// import { useEffect } from 'react';
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// const ProjectPriceChart = () => {
//   useEffect(() => {
//     // Enable the animated theme
//     am4core.useTheme(am4themes_animated);

//     // Create chart instance
//     let chart = am4core.create("projectPriceChart", am4charts.XYChart);

//     // Add data to the chart
//     chart.data = [
//       { category: "Category 1", value: 10 },
//       { category: "Category 2", value: 20 },
//       { category: "Category 3", value: 15 },
//       // Add more data as needed
//     ];

//     // Create category axis and value axis
//     let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
//     categoryAxis.dataFields.category = "category";

//     let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
//     // valueAxis.title.text = "Value";

//     // Create the line series
//     let series = chart.series.push(new am4charts.LineSeries());
//     series.dataFields.categoryX = "category";
//     series.dataFields.valueY = "value";
//     series.tooltipText = "{categoryX}: {valueY}";

//     // Customize the appearance of the line series, if needed
//     series.strokeWidth = 2;
//     series.tensionX = 0.8;

//     // Return a cleanup function to destroy the chart
//     return () => {
//       chart.dispose();
//     };
//   }, []);

//   return <div id="projectPriceChart" style={{ width: "100%", height: "400px" }}></div>;
// };

// export default ProjectPriceChart;

import React, { FC, useEffect } from 'react';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Register components and renderers
echarts.use([LineChart, TooltipComponent, GridComponent, CanvasRenderer]);

type propsType = {
  data: any[]
}

const ProjectPriceChart: FC<propsType> = ({ data = [] }) => {
  useEffect(() => {
    // Create chart instance
    const chart = echarts.init(document.getElementById('chartDiv'));

    // Set the options and data for the chart
    const options = {
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [
          ...data.map((item: any) => item.date)
        ],
        show: false,
      },
      yAxis: {
        name: 'Value',
        type: 'value',
        min: Math.min(...data.map((item: any) => item.value)),
        max: Math.max(...data.map((item: any) => item.value)),
        show: false,
        axisLine: { show: false },
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        backgroundColor: 'rgba(50, 50, 50, 0.7)',
        borderColor: '#333',
        borderRadius: 8,
        borderWidth: 1,
        textStyle: {
          color: '#fff',
        },
        formatter: function (params: any) {
          const category = params[0].axisValue;
          const value = params[0].data;
          const formattedDate = new Date(parseFloat(category)).toISOString().split('T')[0];
          return `Date: ${formattedDate}<br/>Value: ${value}`;
        },
      },
      series: [
        {
          type: 'line',
          smooth: true,
          // areaStyle: {},
          lineStyle: {
            color: 'green'
          },
          data: [
            ...data.map((item: any) => item.value)
          ],
        },
      ],
    };

    chart.setOption(options);

    // Dispose the chart when the component unmounts
    return () => {
      chart.dispose();
    };
  }, [data]);

  return <div id="chartDiv" style={{ width: '100%', height: '200px' }}></div>
};

export default ProjectPriceChart;