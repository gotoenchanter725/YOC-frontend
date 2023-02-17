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

const WETH = "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";

const YOC = {
    address: "0x228D1Ed5F520438ef35f87253fcB1C6Df8267283", 
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
    address: "0xcfe3E78a7Ad6e4bb58FFb52DE7dc2d4E3C2872B1"
}

const YOCSwapFactory = {
    ...YOCSwapFactoryABI, 
    address: "0x94625dC914C88C435b6bD31e0D6f278C3f504bB8"
}

const YOCSwapRouter = {
    ...YOCSwapRouterAPI, 
    address: "0x0FC9eCbe955Bc0421525b8BeE01f3A413a74A20e"
}

const YOCPair = {
    ...YOCPairABI, 
}

const YOCFarm = {
    ...YOCFarmABI, 
    address: "0xd92222686f677889e4A720E89478C944f7906F8b", 
    pools: [3, 4, 5]
}

const YOCPool = {
    ...YOCStakingABI, 
    TokenABI: TokenStakingABI.abi, 
    pools: [
        {
            address: '0xb7De31Bd3193e1206377a0F7D1B417c13C03260d', 
            yoc: true
        }, 
        {
            address: '0x922B81951cc957932DfEBdf736a24af4a6B4d4BA', 
            yoc: false
        }, 
        {
            address: '0xC882255736ea35701CB1D8c633398A15E5302b66', 
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