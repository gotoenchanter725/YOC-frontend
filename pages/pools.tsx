import React, { FC, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Contract, constants } from 'ethers';
const { MaxUint256, AddressZero, Zero } = constants;

import Footer from "../src/components/common/FooterV2";
import Navbar from "../src/components/common/Navbar";
import Modal from "../src/components/widgets/Modalv2";

import { YOCFarm, YOCSwapRouter, TokenTemplate, YOC, YOCPool, USDCToken } from "../src/constants/contracts";
import { TOKENS } from "../src/constants/tokens";
import { rpc_provider_basic } from '../utils/rpc_provider';
import { PairOpenInterface, StakeInterface } from "../src/interfaces/pools";
import { alert_show, loading_end, loading_start, walletConnect } from "../store/actions";
import { convertEthToWei, convertRate, convertWeiToEth } from "../utils/unit";

const Pools: FC = () => {
    return <div>
        <Navbar />
        <Footer emptyLogo={true} />

    </div >
}

export default Pools;