import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic';
import axios from 'axios';
import { PriceChartDataInterface } from '../../interfaces/chart';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const LineChart = () => {
    const [options, setOption] = useState<ApexCharts.ApexOptions>({
        chart: {
            type: 'candlestick',
            height: 250,
            foreColor: 'white',
            dropShadow: {
                enabled: true,
                color: 'red',
            },
        },
        fill: {
            colors: ['red'],
            pattern: {
                style: 'verticalLines',
                width: 4,
                height: 4,
                strokeWidth: 2,
            },
        },
        colors: ['#2AF6FF', '#00DC9F2B'],
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
        },
        markers: {
            size: [4],
            colors: ['#2AF6FF', '#00DC9F2B'],
            strokeColors: '#fff',
            strokeWidth: 2,
            strokeOpacity: 0.9,
            strokeDashArray: 0,
            fillOpacity: 1,
            discrete: [],
            shape: "circle",
            radius: 2,
            offsetX: 0,
            offsetY: 0,
            showNullDataPoints: true,
        },
    })

    const [series, setSeries] = useState([{
        name: "Price",
        data: [{
            x: Date.now(), 
            y: [0, 0, 0, 0]
        }]
    }]);

    useEffect(() => {
        (async () => {
            let res = await axios.get(process.env.API_ADDRESS + '/chart/get');
            if (res && res.data && res.data.prices) {
                let dataArr = res.data.prices.map((item: any) => {
                    return {
                        x: item.datetime,
                        y: [item.from, item.high, item.low, item.to]
                    }
                });

                // console.log(dataArr);
                setSeries([{
                    ...series[0],
                    data: dataArr
                }]);
            }
        })()
    }, [])

    return (
        <div className='w-full'>
            {(typeof window !== 'undefined') &&
                <Chart
                    options={options}
                    series={series}
                    type={"candlestick"}
                    height={window.innerWidth / 4}
                />
            }
        </div>
    )
}

export default LineChart;