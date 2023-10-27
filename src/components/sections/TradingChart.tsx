import { useState, useEffect, FC } from 'react'

import dynamic from 'next/dynamic';
import axios from 'axios';
import { convertPeriodToMiliSecond } from 'utils/features';
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
        data: [{
            x: new Date(), 
            y: 0
        }]
    }]);

    useEffect(() => {
        (async () => {
            if (!period) return;
            let time = convertPeriodToMiliSecond(period);
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