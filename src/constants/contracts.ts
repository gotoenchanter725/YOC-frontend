import ProjectManageABI from "../../contracts/ProjectManage.sol/ProjectManage.json";
import ProjectABI from "../../contracts/Project.sol/Project.json";
import ProjectDetailABI from "../../contracts/ProjectDetail.sol/ProjectDetail.json";
import TokenTemplateABI from "../../contracts/TokenTemplate.sol/TokenTemplate.json";
import USDCTokenABI from "../../contracts/USDC.sol/USDC.json";
import YOCABI from "../../contracts/YOC.sol/YOC.json";
import YOCSwapRouterAPI from "../../contracts/YocswapRouter.sol/YocswapRouter.json";
import YOCSwapFactoryABI from "../../contracts/YocswapFactory.sol/YocswapFactory.json";
import YOCPairABI from "../../contracts/YocswapFactory.sol/YocswapPair.json";
import YOCFarmABI from "../../contracts/YocFarming.sol/YOCMasterChef.json";
import YOCStakingABI from "../../contracts/YocStaking.sol/YocStaking.json";
import TokenStakingABI from "../../contracts/TokenStaking.sol/TokenStaking.json";

const AdminWalletAddress = process.env.AdminWalletAddress + "";

const ProjectManager = {
    ...ProjectManageABI, 
    address: process.env.ProjectManagerAddress + ""
};

const Project = {
    ...ProjectABI
}

const ProjectDetail = {
    ...ProjectDetailABI, 
    address: process.env.ProjectDetailAddress + ""
}

const TokenTemplate = TokenTemplateABI;

const WETH = process.env.WETH + "";

const YOC = {
    address: process.env.YOCAddress + "", 
    decimals: 18, 
    symbol: "YOC", 
    name: "YOC-FoundersCoin", 
    ...YOCABI
}

const USDCToken = {
    ...USDCTokenABI, 
    decimals: 6, 
    symbol: "USDC", 
    name: "USDC-FoundersCoin", 
    address: process.env.USDCAddress + ""
}

const YOCSwapFactory = {
    ...YOCSwapFactoryABI, 
    address: process.env.YOCSwapFactoryAddress + ""
}

const YOCSwapRouter = {
    ...YOCSwapRouterAPI, 
    address: process.env.YOCSwapRouterAddress + ""
}

const YOCPair = {
    ...YOCPairABI, 
}

const YOCFarm = {
    ...YOCFarmABI, 
    address: process.env.YOCFarmAddress + ""
}

const YOCPool = {
    ...YOCStakingABI, 
    TokenABI: TokenStakingABI.abi, 
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
    YOCSwapRouter, 
    YOCSwapFactory, 
    YOCFarm, 
    YOCPool,
    YOCPair
}