import ProjectManageABI from "../../contracts/ProjectManage.sol/ProjectManage.json";
import ProjectABI from "../../contracts/Project.sol/Project.json";
import ProjectDetailABI from "../../contracts/ProjectDetail.sol/ProjectDetail.json";
import TokenTemplateABI from "../../contracts/TokenTemplate.sol/TokenTemplate.json";
import USDCTokenABI from "../../contracts/USDC.sol/USDC.json";
import YOCSwapABI from "../../contracts/YOCSwap.sol/YOCSwap.json";
import BASICABI from "../../contracts/USDC.sol/USDC.json";

const AdminWalletAddress = "0xcAe5d23D4ce4Ea764E219807B2FD8394dc06B6e2"

const ProjectManager = {
    ...ProjectManageABI, 
    address: "0xa73FCe62d419a4933146A8687Ee63d8C6805E14D"
};

const Project = {
    ...ProjectABI
}

const ProjectDetail = {
    ...ProjectDetailABI, 
    address: "0x6e21D5b02708F9566E81EB87fb047D5A1bEE02A5"
}

const TokenTemplate = TokenTemplateABI;

const USDCToken = {
    ...USDCTokenABI, 
    address: "0x2C628401a5a2d79f3920C7e2eE38577eBCACec8d"
}

const YOCSwap = {
    ...YOCSwapABI, 
    address: "0xD04559Fbf8A906Beb6cEE2b493Ef1B6b5004EeDB"
}

export {
    AdminWalletAddress, 
    ProjectManager, 
    Project, 
    ProjectDetail, 
    TokenTemplate, 
    USDCToken, 
    YOCSwap
}