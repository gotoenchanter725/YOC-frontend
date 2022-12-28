import { ethers } from "ethers";

const rpc_url = process.env.env == 'development' ? process.env.TEST_NETWORK_URL : process.env.MAIN_NETWORK_URL;

const rpc_provider_basic = new ethers.providers.JsonRpcProvider(rpc_url);

export {
    rpc_provider_basic
}