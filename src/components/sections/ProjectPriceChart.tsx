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
import { LineChart, BarChart } from 'echarts/charts';
import { TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Register components and renderers
echarts.use([LineChart, BarChart, TooltipComponent, GridComponent, CanvasRenderer]);

type propsType = {
  data: any[],
  comparedData?: any[],
}

const ProjectPriceChart: FC<propsType> = ({ data = [], comparedData }) => {
  useEffect(() => {
    // Create chart instance
    const mainChart = echarts.init(document.getElementById('chartDiv'));
    // Set the mainOptions and data for the chart
    const mainOptions = {
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
        min: Math.min(...[...data.map((item: any) => item.value), ...(comparedData ? comparedData.map((item: any) => item.value) : [])]) * 0.9,
        max: Math.max(...[...data.map((item: any) => item.value), ...(comparedData ? comparedData.map((item: any) => item.value) : [])]) * 1.1,
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
          console.log(params);
          if (params.length == 1) {
            const category = params[0].axisValue;
            const value = params[0].data;
            const formattedDate = new Date(parseFloat(category)).toISOString().split('T')[0];
            return `Date: ${formattedDate}<br/>Value: ${value}`;
          } else if (params.length == 2) {
            const category = params[0].axisValue;
            const value = params[0].data;
            const cValue = params[1].data;
            const formattedDate = new Date(parseFloat(category)).toISOString().split('T')[0];
            return `<div>
              Date: ${formattedDate}<br/>Value1: ${value}<br/>
              Value2: ${cValue}<br/>
            </div>`
          }
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
        ...(comparedData?.length ? [{
          type: 'line',
          smooth: true,
          // areaStyle: {},
          lineStyle: {
            color: 'red'
          },
          data: [
            ...comparedData.map((item: any) => item.value)
          ],
        }] : [])
      ],
    };
    mainChart.setOption(mainOptions);

    // diff chart
    const diffChart = echarts.init(document.getElementById('diffChartDiv'));
    const diffOptions = {
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        containLabel: true,
      },
      xAxis: {
        boundaryGap: false,
        type: 'category',
        data: [
          ...data.map((item: any) => item.date)
        ],
        show: false,
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: [
        {
          data: [
            ...data.map((item: any, index) => (comparedData && comparedData[index]) ? item.value - comparedData[index].value : 0)
          ],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }
      ]
    };
    diffChart.setOption(diffOptions);

    // Dispose the chart when the component unmounts
    return () => {
      mainChart.dispose();
      diffChart.dispose();
    };
  }, [data, comparedData]);

  return <div>
    <div id="chartDiv" style={{ width: '100%', height: '200px' }}></div>
    <div id="diffChartDiv" style={{ width: '100%', height: (comparedData && comparedData.length) ? '60px' : '0px' }}></div>
  </div>
};

export default ProjectPriceChart;