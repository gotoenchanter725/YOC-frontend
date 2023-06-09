import { useState, useEffect } from 'react';
import axios from 'axios';

import TotalLockedBubbleChart from "./TotalLockedBubbleChart";
import { showBigNumber } from "../../../utils/unit";

const TotalLockedBubbleChartSection = () => {
    const [period, setPeriod] = useState("1D");
    const [latestPrice, setLatestPrice] = useState(0);
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
            let res = await axios.get(process.env.API_ADDRESS + '/chart/tvl-get?period=' + time);
            if (res && res.data && res.data.prices) {
                const tmp = res.data.prices[res.data.prices.length - 1];
                if (tmp) setLatestPrice(tmp.price);
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

    return <div className="w-full mb-8">
        <div className="container mx-auto">
            <div className="w-full bg-primary-pattern p-6">
                <div className="w-full flex justify-between">
                    <div className="hidden lg:block w-[25%] mt-16">
                        <p className="text-3xl font-light mb-8">Description</p>
                        <p className="text-xl font-light leading-9">
                            YOC token is at the core of this
                            Decentralized Finance ecosystem.
                            Real Time Token Value: "Lorum
                            Ipsum "</p>
                    </div>
                    <div className="w-full lg:w-[70%]">
                        <div className="w-full flex justify-center mb-4">
                            <p className="text-3xl font-light">Total Value Locked : {showBigNumber(latestPrice)}</p>
                        </div>
                        <TotalLockedBubbleChart />
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default TotalLockedBubbleChartSection;