import { useState } from 'react'

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const TotalLockedBubbleChart = () => {
    const [options, setOption] = useState<ApexCharts.ApexOptions>({
        chart: {
            type: 'candlestick',
            foreColor: 'white',
            dropShadow: {
                enabled: true,
                color: 'red',
            },
        },
        colors: ['#2AF6FF', '##00DC9F2B'],
        xaxis: {
            type: 'datetime',
            tooltip: {
                enabled: false
            }
        },
        yaxis: {
            tooltip: {
                enabled: false
            },
            max: 70
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            },
        },
    })

    const [series, setSeries] = useState([{
        name: 'TEAM 1',
        data: [{
            x: new Date(1538778600000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538780400000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538782200000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538784000000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538785800000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538787600000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538789400000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538791200000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538793000000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538794800000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538796600000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538798400000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538800200000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538802000000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538803800000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538805600000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538807400000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538809200000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538811000000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538812800000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538814600000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538816400000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538818200000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538820000000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538821800000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538823600000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538825400000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538827200000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538829000000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538830800000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538832600000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538834400000),
            y: [Math.floor(Math.random() * 80)]
        },
        {
            x: new Date(1538836200000),
            y: [Math.floor(Math.random() * 80)]
        },
        ]
    }]);

    return (
        <div>
            {(typeof window !== 'undefined') &&
                <Chart
                    options={options}
                    series={series}
                    type={"scatter"}
                    height={350}
                />
            }
        </div>
    )
}

export default TotalLockedBubbleChart;