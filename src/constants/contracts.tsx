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

const USDCToken = {
    ...USDCTokenABI, 
    address: "0xbb9b0c89C100610E238e7e9dd9DDB954Df2BE199"
}

const YOCSwapRouter = {
    ...YOCSwapRouterAPI, 
    address: "0x40266001ef3db4D33Bba29F105dfc61cc33eE5B6"
}

const YOCSwapFactory = {
    ...YOCSwapFactoryAPI, 
    address: "0xaAEc40a06542F89Cf171defc07400219A6347082"
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