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

const AdminWalletAddress = "0x5141383723037FBd3818dAEcb7d4C5DF1Dc8c6B1"

const ProjectManager = {
    ...ProjectManageABI, 
    address: "0x100abd96d948CcEbe13f7ca1c9D35811fa3b73D8"
};

const Project = {
    ...ProjectABI
}

const ProjectDetail = {
    ...ProjectDetailABI, 
    address: "0x86D7F06af5E0D517835361c962234A96074431EF"
}

const TokenTemplate = TokenTemplateABI;

const WETH = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";

const YOC = {
    address: "0x5A3B9f4a4aD616f67D3406967516eEB50B6cc379", 
    decimals: 18, 
    ...YOCABI
}

const USDCToken = {
    ...USDCTokenABI, 
    decimals: 6, 
    address: "0x587FE7dE6Cfaa1C2961747efB05eb5E399C661f5"
}

const YOCSwapFactory = {
    ...YOCSwapFactoryABI, 
    address: "0xb5adA6454C59ef7E340004Bf81B1e75087eb68f8"
}

const YOCSwapRouter = {
    ...YOCSwapRouterAPI, 
    address: "0x369ccED38f349A61bfea7CC2489999AA065c5667"
}

const YOCPair = {
    ...YOCPairABI, 
}

const YOCFarm = {
    ...YOCFarmABI, 
    address: "0x4Af2aCdB241937d32Ec1A15F2b3E48768161DE10", 
    pools: [3, 4, 5]
}

const YOCPool = {
    ...YOCStakingABI, 
    TokenABI: TokenStakingABI.abi, 
    pools: [
        {
            address: '0x3e36F110fC355E2C819a84aa4a3697f7E74cF64c', 
            yoc: true
        }, 
        {
            address: '0xe4A4a973412eC04FD3325b564e5F7172286c577b', 
            yoc: false
        }, 
        {
            address: '0x18F7fb60b29a6aE6d63822fa25aa457a90bBB8F3', 
            yoc: false
        }, 
    ]
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