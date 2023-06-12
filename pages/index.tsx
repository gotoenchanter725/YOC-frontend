import React, { FC, useState } from "react";
import TotalLockedBubbleChart from "@components/sections/TotalLockedBubbleChart";
import TradingChart from "@components/sections/TradingChart";
import YocPriceLineChart from "@components/sections/YocPriceLineChart";
import Period from "@components/widgets/Period";
import TotalLockedBubbleChartSection from "@components/sections/TotalLockedBubbleChartSection";

const howitworksData = [
  {
    title: "Project Selection",
    content: "Select the project that appeal’s you best among all the options we have to learn more about it.",
    image: "/images/selection.png"
  },
  {
    title: "Analysis and Invest",
    content: "With objective indicators, in a few minutes it is possible to analyze and invest 100% online and safety in a brand new companies.",
    image: "/images/analysis.png"
  },
  {
    title: "Follow Your Investment",
    content: "After investing in a company, the token holder will be able to follow all the evolution and will have a lot of benefits from being the token holder.",
    image: "/images/follow.png"
  },
  {
    title: "Receive The Dividends",
    content: "Based on the amount of token you hold, a snapshot will be taken every quarter and based on that the company’s dividends will be paid.",
    image: "/images/receive.png"
  },
]

const projectsData = [
  {
    title: 'Launches',
    image: "./images/launches.png"
  },
  {
    title: 'Financials',
    image: "./images/financials.png"
  },
  {
    title: 'Sports',
    image: "./images/sports.png"
  },
  {
    title: 'Entertainment',
    image: "./images/entertainment.png"
  },
  {
    title: 'Real Estate',
    image: "./images/real_estate.png"
  },
  {
    title: 'Restaurants',
    image: "./images/restaurants.png"
  },
  {
    title: 'Shoppings',
    image: "./images/shopping.png"
  },
  {
    title: 'Production',
    image: "./images/production.png"
  }
]

const HomePage: FC = () => {
  const [period, setPeriod] = useState("1D");

  return <>
    <div className="container mx-auto">
      <div className="w-full flex flex-row justify-between mt-12">
        <div className="w-[60%] lg:w-[40%]">
          <h2 className="mt-6 text-3xl lg:text-5xl font-bold leading-[150%]">Where The Virtual And Real World Merge In One World</h2>
        </div>
        <img className="w-[40%] lg:w-[50%]" src="/images/home.png" alt="home" />
      </div>
    </div>

    <div className="w-full bg-[#252525] py-8 -z-10">
      <div className="container mx-auto">
        <h4 className="w-full text-center font-bold text-3xl mb-8">How it work's</h4>
        <div className="w-full grid gap-6 grid-cols-2 lg:grid-cols-4">
          {
            howitworksData.map((item, index) => {
              return <div key={index + "_howitwork"} className={`h-full p-3 rounded-lg bg-home-box${index + 1}`}>
                <div className="h-full flex flex-col items-center rounded-lg bg-[#1e1e1e] p-4">
                  <img className="w-[72px] h-[72px] my-6" src={item.image} alt='project section' />
                  <h5 className="font-semibold text-lg mb-4">{item.title}</h5>
                  <p className="font-light leading-8 text-dark-primary">{item.content}</p>
                </div>
              </div>
            })
          }
        </div>
      </div>
    </div>

    <div className="hidden lg:block w-full py-8 bg-[#151515]">
      <div className="container mx-auto flex items-center justify-between">
        <div className="w-1/3 flex flex-col items-center">
          <h3 className="text-3xl font-bold">Unique Features</h3>
          <img className="w-full" src="./images/unique.png" alt="unique" />
        </div>
        <div className="w-2/3 relative">
          <img className="w-[320px] absolute right-0 top-0" src="./images/logo.png" alt="logo" />
          <h4 className="font-bold text-xl mb-6">All investments will be guaranteed by smart contracts.</h4>
          <ul className="list-disc">
            <li className="ml-6 mb-4 font-extralight">Each project will have its own token.</li>
            <li className="ml-6 mb-4 font-extralight">Project tokens will have limited quantity.</li>
            <li className="ml-6 mb-4 font-extralight">The project will kick off when get´s 70% of fund raise amount.</li>
            <li className="ml-6 mb-4 font-extralight">All projects accounts will be open to the token owner.</li>
            <li className="ml-6 mb-4 font-extralight">No administration fee , only perfomance fee (10%) . So we only make money with token holder makes money.</li>
            <li className="ml-6 mb-4 font-extralight">All profit from the business will be sent to the token owners, based on the amount each one has.</li>
            <li className="ml-6 mb-4 font-extralight">All major decisions will be voted on by the token owners, based on the amount each one has.</li>
            <li className="ml-6 mb-4 font-extralight">If we cannot reach 70% (Pre determined time)of the pre‐set amount of fund raiser we will return 100% of the funds.</li>
            <li className="ml-6 mb-4 font-extralight">A unique ecosystem, with fundraising, farms and pools, all integrated.</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="hidden lg:block w-full py-8">
      <div className="container mx-auto">
        <h4 className="w-full text-center font-bold text-3xl mb-8">Projects</h4>

        <div className="w-full grid gap-x-6 gap-y-8 grid-cols-4">
          {
            projectsData.map((item, index) => {
              return <div key={index + '_project'} className="pt-[64px]">
                <div className="w-full flex flex-col items-center pb-4 pt-[72px] rounded-[25px] border border-[#fffbfb42] bg-box-pattern relative">
                  <img className="h-[120px] absolute left-[calc(50%_-_60px)] -top-[60px]" src={item.image} alt="launches" />
                  <p className="text-center font-semibold text-lg">{item.title}</p>
                </div>
              </div>
            })
          }
        </div>
      </div>
    </div>

    <div className="w-full mb-8">
      <div className="container mx-auto">
        <div className="w-full bg-primary-pattern p-6">
          <div className="w-full flex justify-between items-center">
            <div className="w-full lg:w-[70%]">
              <div className="w-full flex justify-between mb-4">
                <p className="text-2xl font-light">Trading Volume</p>
              </div>
              <YocPriceLineChart />
            </div>
            <p className="hidden lg:block lg:w-[25%] text-lg font-extralight leading-8">
              YOC token is at the core of this
              Decentralized Finance ecosystem.
              Real Time Token Value: "Lorum Ipsum "
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* <TotalLockedBubbleChartSection /> */}

    <div className="w-full mb-8">
      <div className="container mx-auto">
        <div className="w-full bg-primary-pattern p-6">
          <div className="w-full flex justify-between">
            <div className="w-full lg:w-[70%]">
              <div className="w-full flex justify-between items-center mb-4">
                <p className="text-2xl font-light">Trading Volume</p>
                <Period value={period} setValue={(v) => setPeriod(v)} />
              </div>
              {/* <TradingChart period={period} /> */}
            </div>
            <div className="hidden lg:block w-[25%]">
              <p className="text-2xl font-light mb-6">Description</p>
              <p className="text-lg font-light leading-8">Lorem ipsum dolor sit amet,
                consectetur adipiscing elit.
                Tempus quisque id arcu va
                sit in erat eget urna.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}

export default HomePage
