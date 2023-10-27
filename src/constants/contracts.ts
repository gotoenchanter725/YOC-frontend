import ProjectManageABI from "../../contracts/ProjectManage.sol/ProjectManage.json";
import ProjectABI from "../../contracts/Project.sol/Project.json";
import ProjectDetailABI from "../../contracts/ProjectDetail.sol/ProjectDetail.json";
import TokenTemplateABI from "../../contracts/TokenTemplate.sol/TokenTemplate.json";
import USDCTokenABI from "../../contracts/USDC.sol/USDC.json";
import YOCABI from "../../contracts/YOC.sol/YOC.json";
import YUSDABI from "../../contracts/YUSD.sol/YUSD.json";
import YOCSwapRouterAPI from "../../contracts/YocswapRouter.sol/YocswapRouter.json";
import YOCSwapFactoryABI from "../../contracts/YocswapFactory.sol/YocswapFactory.json";
import YOCPairABI from "../../contracts/YocswapFactory.sol/YocswapPair.json";
import YOCFarmABI from "../../contracts/YocFarming.sol/YOCMasterChef.json";
import YOCStakingABI from "../../contracts/YocStaking.sol/YocStaking.json";
import TokenStakingABI from "../../contracts/TokenStaking.sol/TokenStaking.json";
import ProjectTradeABI from "../../contracts/ProjectTrade.sol/ProjectTrade.json";

import { NETWORK, CONTRACT_ADDRESS } from "../config/contract";

const AdminWalletAddress = CONTRACT_ADDRESS.AdminWalletAddress + "";

const ProjectManager = {
    ...ProjectManageABI,
    address: CONTRACT_ADDRESS.ProjectManagerAddress + ""
};

const Project = {
    ...ProjectABI
}

const ProjectDetail = {
    ...ProjectDetailABI,
    address: CONTRACT_ADDRESS.ProjectDetailAddress + ""
}

const TokenTemplate = TokenTemplateABI;

const WETH = CONTRACT_ADDRESS.WETH + "";

const YOC = {
    address: CONTRACT_ADDRESS.YOCAddress + "",
    decimals: 18,
    symbol: "YOC",
    name: "YOC-FoundersCoin",
    ...YOCABI
}

const YUSD = {
    address: CONTRACT_ADDRESS.YUSDAddress + "",
    decimals: 6,
    symbol: "YUSD",
    name: "YUSD",
    ...YUSDABI
}

const USDCToken = {
    ...USDCTokenABI,
    decimals: 6,
    symbol: "USDC",
    name: "USDC-FoundersCoin",
    address: CONTRACT_ADDRESS.USDCAddress + ""
}

const YOCSwapFactory = {
    ...YOCSwapFactoryABI,
    address: CONTRACT_ADDRESS.YOCSwapFactoryAddress + ""
}

const YOCSwapRouter = {
    ...YOCSwapRouterAPI,
    address: CONTRACT_ADDRESS.YOCSwapRouterAddress + ""
}

const YOCPair = {
    ...YOCPairABI,
    decimals: 18,
}

const YOCFarm = {
    ...YOCFarmABI,
    address: CONTRACT_ADDRESS.YOCFarmAddress
}

const YOCPool = {
    ...YOCStakingABI,
    TokenABI: TokenStakingABI.abi,
}
const ProjectTrade = {
    ...ProjectTradeABI,
    address: CONTRACT_ADDRESS.ProjectTradeAddress,
}

export {
    AdminWalletAddress,
    ProjectManager,
    Project,
    ProjectDetail,
    TokenTemplate,
    WETH,
    USDCToken,
    YOC,
    YUSD,
    YOCSwapRouter,
    YOCSwapFactory,
    YOCFarm,
    YOCPool,
    YOCPair,
    ProjectTrade,
}