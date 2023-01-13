import ProjectManageABI from "../../contracts/ProjectManage.sol/ProjectManage.json";
import ProjectABI from "../../contracts/Project.sol/Project.json";
import ProjectDetailABI from "../../contracts/ProjectDetail.sol/ProjectDetail.json";
import TokenTemplateABI from "../../contracts/TokenTemplate.sol/TokenTemplate.json";
import USDCTokenABI from "../../contracts/USDC.sol/USDC.json";
import YOCSwapRouterAPI from "../../contracts/YocswapRouter.sol/YocswapRouter.json";
import YOCSwapFactoryABI from "../../contracts/YocswapFactory.sol/YocswapFactory.json";
import YOCPairABI from "../../contracts/YocswapFactory.sol/YocswapPair.json";
import YOCFarmABI from "../../contracts/YocFarming.sol/YOCMasterChef.json";
import YOCPoolABI from "../../contracts/YocPool.sol/YocPool.json";

const AdminWalletAddress = "0x5141383723037FBd3818dAEcb7d4C5DF1Dc8c6B1"

const ProjectManager = {
    ...ProjectManageABI, 
    address: "0x5Fb5766f39ABFaECE532d8c90C71a9B31F070A28"
};

const Project = {
    ...ProjectABI
}

const ProjectDetail = {
    ...ProjectDetailABI, 
    address: "0x679CB8a6671E490b7874DF90F6F82753c7163E56"
}

const TokenTemplate = TokenTemplateABI;

const USDCToken = {
    ...USDCTokenABI, 
    address: "0x4f88ccc080246172D680041FAAc681ae48F6Ea4c"
}

const YOCSwapRouter = {
    ...YOCSwapRouterAPI, 
    address: "0x5044F1986EA335765E39bD191376eB6830DFF58b"
}

const YOCSwapFactory = {
    ...YOCSwapFactoryABI, 
    address: "0x122f4421A7f52A45e9e65ceBcb712C2961c32835"
}

const YOCFarm = {
    ...YOCFarmABI, 
    address: "0xaAEc40a06542F89Cf171defc07400219A6347082"
}

const YOCPool = {
    ...YOCPoolABI, 
    address: [
        // '0x3464f0F6AAa56C78fF3060d62d9C1be90bef61bc', 
        // '0xF58913AB1c6Fed1B40D293A2266053a5DAf9AB48'
        // '0x8d22219Dbc8B096632B352A0bD7815801e59173D'
        '0xD70097ECC3AdC255259a34Ffd568EfAD4ab34e0a'
    ]
}

const YOCPair = {
    ...YOCPairABI, 
}

const YOC = {
    address: "0x3EFb72DA89a6d1060A1D6c28a2564a235F5Bf38d", 
    ...TokenTemplateABI
}

export {
    AdminWalletAddress, 
    ProjectManager, 
    Project, 
    ProjectDetail, 
    TokenTemplate, 
    USDCToken, 
    YOC, 
    YOCSwapRouter, 
    YOCSwapFactory, 
    YOCFarm, 
    YOCPool,
    YOCPair
}