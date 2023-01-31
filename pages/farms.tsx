import React, { FC, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Contract, constants } from 'ethers';
const { MaxUint256, AddressZero, Zero } = constants;

import Footer from "../src/components/common/FooterV2";
import Navbar from "../src/components/common/Navbar";
import Modal from "../src/components/widgets/Modalv2";

import { YOCFarm, YOCSwapRouter, YOCPair, TokenTemplate, YOC, USDCToken } from "../src/constants/contracts";
import { rpc_provider_basic } from '../utils/rpc_provider';
import { PoolInterface, PairOpenInterface } from "../src/interfaces/pools";
import { alert_show, loading_end, loading_start, walletConnect } from "../store/actions";
import { convertEthToWei, convertRate, convertWeiToEth } from "../utils/unit";
import { WALLET_CONNECT } from "../store/types";

const Farm: FC = () => {

    return <div>
        <Navbar />
        <div className="container mx-auto">
        </div>
        <Footer emptyLogo={true} />
    </div >
}

export default Farm;