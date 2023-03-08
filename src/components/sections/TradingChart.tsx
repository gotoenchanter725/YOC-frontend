import { useState, useEffect, FC } from 'react'

import dynamic from 'next/dynamic';
import axios from 'axios';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Props = {
    period: string;
}

const TradingChart: FC<Props> = ({ period }) => {
    const [options, setOption] = useState<ApexCharts.ApexOptions>({
        chart: {
            type: 'candlestick',
            foreColor: 'white',
            dropShadow: {
                enabled: true,
                color: 'red',
            }
        },
        colors: ['#Fe2', '#e2e'],
        xaxis: {
            type: 'datetime',
            tooltip: {
                enabled: false
            }
        },
        yaxis: {
            opposite: true,
            tooltip: {
                enabled: false
            },
        },
    })

    const [series, setSeries] = useState([{
        data: []
    }]);

    useEffect(() => {
        (async () => {
            if (!period) return;
            let time;
            switch (period) {
                case '1D':
                    time = 1000 * 60 * 60 * 24;
                    break;
                case '1W':
                    time = 1000 * 60 * 60 * 24 * 7;
                    break;
                case '1M':
                    time = 1000 * 60 * 60 * 24 * 30;
                    break;
                case '1M':
                    time = 1000 * 60 * 60 * 24 * 30 * 3;
                    break;
                case '1Y':
                    time = 1000 * 60 * 60 * 24 * 30 * 12;
                    break;
                case '1Y':
                    time = 1000 * 60 * 60 * 24 * 30 * 12 * 3;
                    break;
                default:
                    time = 1000 * 60 * 60 * 24 * 30 * 12 * 2000;
                    break;
            }
            let res = await axios.get(process.env.API_ADDRESS + '/chart/get?period=' + time);
            if (res && res.data && res.data.prices) {
                let dataArr = res.data.prices.map((item: any) => {
                    return {
                        x: item.datetime,
                        y: [item.from, item.high, item.low, item.to]
                    }
                });
                setSeries([{
                    ...series[0],
                    data: dataArr
                }]);
            }
        })()
    }, [period])

    return (
        <div>
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

export default TradingChart;