import React, { FC, useState } from "react";
import Footer from "../src/components/common/FooterV2";
import Navbar from "../src/components/common/Navbar";
import TotalLockedBubbleChart from "../src/components/sections/TotalLockedBubbleChart";
import TradingChart from "../src/components/sections/TradingChart";
import YocPriceLineChart from "../src/components/sections/YocPriceLineChart";
import Period from "../src/components/widgets/Period";

const HomePage: FC = () => {
  const [period, setPeriod] = useState("1D");

  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <div className="w-full flex justify-between mt-12">
          <div className="w-[40%]">
            <h2 className="text-5xl font-bold leading-[150%]">Where The Virtual And Real World Merge In One World</h2>
          </div>
          <img src="/images/home.png" alt="home" />
        </div>
      </div>

      <div className="w-full bg-[#252525] py-8 -z-10">
        <div className="container mx-auto">
          <h4 className="w-full text-center font-bold text-3xl mb-8">How it work's</h4>
          <div className="w-full grid gap-6 grid-cols-2 md:grid-cols-4">
            <div className="h-full p-3 rounded-lg bg-home-box1">
              <div className="h-full flex flex-col items-center rounded-lg bg-[#1e1e1e] p-4">
                <img className="w-[72px] h-[72px] my-6" src="/images/selection.png" alt='project section' />
                <h5 className="font-semibold text-lg mb-4">Project Selection</h5>
                <p className="font-light leading-8 text-dark-primary">Select the project that appeal’s you best among all the options we have to learn more about it.</p>
              </div>
            </div>

            <div className="h-full p-3 rounded-lg bg-home-box2">
              <div className="h-full flex flex-col items-center rounded-lg bg-[#1e1e1e] p-4">
                <img className="w-[72px] h-[72px] my-6" src="/images/analysis.png" alt='Analysis and Invest' />
                <h5 className="font-semibold text-lg mb-4">Analysis and Invest</h5>
                <p className="font-light leading-8 text-dark-primary">With  objective indicators, in a few minutes it is possible to analyze and invest 100% online and safety in a brand new companies.</p>
              </div>
            </div>

            <div className="h-full p-3 rounded-lg bg-home-box3">
              <div className="h-full flex flex-col items-center rounded-lg bg-[#1e1e1e] p-4">
                <img className="w-[72px] h-[72px] my-6" src="/images/selection.png" alt='project section' />
                <h5 className="font-semibold text-lg mb-4">Follow Your Investment</h5>
                <p className="font-light leading-8 text-dark-primary">After investing in a company, the token holder will be able to follow all the evolution and will have a lot of benefits from being the token holder.</p>
              </div>
            </div>

            <div className="h-full p-3 rounded-lg bg-home-box4">
              <div className="h-full flex flex-col items-center rounded-lg bg-[#1e1e1e] p-4">
                <img className="w-[72px] h-[72px] my-6" src="/images/selection.png" alt='project section' />
                <h5 className="font-semibold text-lg mb-4">Receive The Dividends</h5>
                <p className="font-light leading-8 text-dark-primary">Based on the amount of token you hold, a snapshot will be taken every quarter and based on that the company’s dividends will be paid.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-8 bg-[#151515]">
        <div className="container mx-auto flex items-center justify-between">
          <div className="w-1/3 flex flex-col items-center">
            <h3 className="text-3xl font-bold">Unique Features</h3>
            <img className="w-full" src="./images/unique.png" alt="unique" />
          </div>
          <div className="w-2/3 relative">
            <img className="absolute right-0 top-0" src="./images/logo.png" alt="logo" />
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

      <div className="w-full py-8">
        <div className="container mx-auto">
          <h4 className="w-full text-center font-bold text-3xl mb-8">Projects</h4>

          <div className="w-full grid gap-x-6 gap-y-8 grid-cols-4">
            <div className="pt-[64px]">
              <div className="w-full flex flex-col items-center pb-4 pt-[72px] rounded-[25px] border border-[#fffbfb42] bg-box-pattern relative">
                <img className="h-[145px] absolute left-[calc(50%_-_72px)] -top-[70px]" src="./images/launches.png" alt="launches" />
                <p className="text-center font-semibold text-lg">Launches</p>
              </div>
            </div>
            <div className="pt-[64px]">
              <div className="w-full flex flex-col items-center pb-4 pt-[72px] rounded-[25px] border border-[#fffbfb42] bg-box-pattern relative">
                <img className="h-[145px] absolute left-[calc(50%_-_72px)] -top-[70px]" src="./images/financials.png" alt="Financials" />
                <p className="text-center font-semibold text-lg">Financials</p>
              </div>
            </div>
            <div className="pt-[64px]">
              <div className="w-full flex flex-col items-center pb-4 pt-[72px] rounded-[25px] border border-[#fffbfb42] bg-box-pattern relative">
                <img className="h-[145px] absolute left-[calc(50%_-_72px)] -top-[70px]" src="./images/sports.png" alt="Sports" />
                <p className="text-center font-semibold text-lg">Sports</p>
              </div>
            </div>
            <div className="pt-[64px]">
              <div className="w-full flex flex-col items-center pb-4 pt-[72px] rounded-[25px] border border-[#fffbfb42] bg-box-pattern relative">
                <img className="h-[145px] absolute left-[calc(50%_-_72px)] -top-[70px]" src="./images/entertainment.png" alt="Entertainment" />
                <p className="text-center font-semibold text-lg">Entertainment</p>
              </div>
            </div>
            <div className="pt-[64px]">
              <div className="w-full flex flex-col items-center pb-4 pt-[72px] rounded-[25px] border border-[#fffbfb42] bg-box-pattern relative">
                <img className="h-[145px] absolute left-[calc(50%_-_72px)] -top-[70px]" src="./images/real_estate.png" alt="Real Estate" />
                <p className="text-center font-semibold text-lg">Real Estate</p>
              </div>
            </div>
            <div className="pt-[64px]">
              <div className="w-full flex flex-col items-center pb-4 pt-[72px] rounded-[25px] border border-[#fffbfb42] bg-box-pattern relative">
                <img className="h-[145px] absolute left-[calc(50%_-_72px)] -top-[70px]" src="./images/restaurants.png" alt="Restaurants" />
                <p className="text-center font-semibold text-lg">Restaurants</p>
              </div>
            </div>
            <div className="pt-[64px]">
              <div className="w-full flex flex-col items-center pb-4 pt-[72px] rounded-[25px] border border-[#fffbfb42] bg-box-pattern relative">
                <img className="h-[145px] absolute left-[calc(50%_-_72px)] -top-[70px]" src="./images/shopping.png" alt="Shoppings" />
                <p className="text-center font-semibold text-lg">Shoppings</p>
              </div>
            </div>
            <div className="pt-[64px]">
              <div className="w-full flex flex-col items-center pb-4 pt-[72px] rounded-[25px] border border-[#fffbfb42] bg-box-pattern relative">
                <img className="h-[145px] absolute left-[calc(50%_-_72px)] -top-[70px]" src="./images/production.png" alt="launcProductionhes" />
                <p className="text-center font-semibold text-lg">Production</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mb-8">
        <div className="container mx-auto">
          <div className="w-full bg-primary-pattern p-6">
            <div className="w-full flex justify-between items-center">
              <div className="w-[70%]">
                <div className="w-full flex justify-between mb-4">
                  <p className="text-2xl font-light">Trading Volume</p>
                </div>
                <YocPriceLineChart />
              </div>
              <p className="w-[25%] text-lg font-extralight leading-8">
                YOC token is at the core of this
                Decentralized Finance ecosystem.
                Real Time Token Value: "Lorum Ipsum "
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mb-8">
        <div className="container mx-auto">
          <div className="w-full bg-primary-pattern p-6">
            <div className="w-full flex justify-between">
              <div className="w-[25%] mt-16">
                <p className="text-3xl font-light mb-8">Description</p>
                <p className="text-xl font-light leading-9">YOC token is at the core of this
                  Decentralized Finance ecosystem.
                  Real Time Token Value: "Lorum
                  Ipsum "</p>
              </div>
              <div className="w-[70%]">
                <div className="w-full flex justify-center mb-4">
                  <p className="text-3xl font-light">Total Value Locked</p>
                </div>
                <TotalLockedBubbleChart />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mb-8">
        <div className="container mx-auto">
          <div className="w-full bg-primary-pattern p-6">
            <div className="w-full flex justify-between">
              <div className="w-[70%]">
                <div className="w-full flex justify-between mb-4">
                  <p className="text-2xl font-light">Trading Volume</p>
                  <Period value={period} setValue={(v) => setPeriod(v)} />
                </div>
                <TradingChart period={period} />
              </div>
              <div className="w-[25%]">
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

      <Footer />
    </>
  )
}

export default HomePage
