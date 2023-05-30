import { ethers } from "ethers";
import { NETWORK } from "../src/config/contract";

const rpc_url = process.env.env == 'development' ? NETWORK.testnet.RPC_URL : NETWORK.mainnet.RPC_URL;

const rpc_provider_basic = new ethers.providers.JsonRpcProvider(rpc_url);

export {
    rpc_provider_basic
}