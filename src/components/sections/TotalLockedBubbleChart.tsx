import { useState, useEffect } from 'react';
import axios from 'axios';

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
        name: 'Total Value Locked USD',
        data: []
    }]);

    useEffect(() => {
        (async () => {
            let res = await axios.get(process.env.API_ADDRESS + '/chart/tvl-get');
            if (res && res.data && res.data.prices) {
                let dataArr = res.data.prices.map((item: any) => {
                    return {
                        x: new Date(item.datetime),
                        y: [item.price]
                    }
                });
                console.log(dataArr);

                console.log(Math.floor(Math.random() * 80));

                setSeries([{
                    ...series[0],
                    data: dataArr
                }]);
            }
        })()
    }, [])

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