import ProjectManageABI from "../../contracts/ProjectManage.sol/ProjectManage.json";
import ProjectABI from "../../contracts/Project.sol/Project.json";
import ProjectDetailABI from "../../contracts/ProjectDetail.sol/ProjectDetail.json";
import TokenTemplateABI from "../../contracts/TokenTemplate.sol/TokenTemplate.json";
import USDCTokenABI from "../../contracts/USDC.sol/USDC.json";
import YOCSwapRouterAPI from "../../contracts/YocswapRouter.sol/YocswapRouter.json";
import YOCSwapFactoryAPI from "../../contracts/YocswapFactory.sol/YocswapFactory.json";

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
    ...YOCSwapFactoryAPI, 
    address: "0x122f4421A7f52A45e9e65ceBcb712C2961c32835"
}

export {
    AdminWalletAddress, 
    ProjectManager, 
    Project, 
    ProjectDetail, 
    TokenTemplate, 
    USDCToken, 
    YOCSwapRouter, 
    YOCSwapFactory
}