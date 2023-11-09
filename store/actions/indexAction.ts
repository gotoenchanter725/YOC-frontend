import {
  GET_PROJECT_INFO,
  PROJECT_INFO_RETIREVEING,
  PROJECT_INFO_UPDATE,
  PROJECT_INFO_UPDATE_BY_PROJECT_ADDRESS,
  PROJECT_INFO_ERROR
} from "../types";
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { publicProvider } from 'wagmi/providers/public'
import { Contract, ethers } from "ethers";
import { rpc_provider_basic } from "../../utils/rpc_provider";
import {
  ProjectManager,
  ProjectDetail,
  YOC,
  TokenTemplate,
} from "../../src/constants/contracts";
import { convertWeiToEth } from "../../utils/unit";
import { NETWORK } from "../../src/config/contract";

let web3Modal: any;

const projectDetailInfo = async (address: any, connectedAddress = "0x0000000000000000000000000000000000000000") => {
  try {
    let detailAddress = ProjectDetail.address;
    const detailContract = new Contract(detailAddress, ProjectDetail.abi, rpc_provider_basic);
    let detailProject = await detailContract.getProjectDetails(address, connectedAddress);

    const projectDetailObj: any = {};
    const shareTokenAddress = detailProject.shareToken;
    const investTokenAddress = detailProject.investToken;
    const shareDecimal_temp = Number(ethers.utils.formatUnits(detailProject.shareTokenDecimals, 0));
    const investDecimal_temp = Number(ethers.utils.formatUnits(detailProject.investTokenDecimals, 0));
    const totalRaise_temp = Number(ethers.utils.formatUnits(detailProject.investTotalAmount, investDecimal_temp));
    const totalYTEST_temp = Number(ethers.utils.formatUnits(detailProject.shareTokenSellAmount, shareDecimal_temp));
    const shareTokenAmount_temp = Number(ethers.utils.formatUnits(detailProject.shareTokenBalanceTemp, shareDecimal_temp));

    projectDetailObj.poolAddress = address;
    projectDetailObj.APR = Number(ethers.utils.formatUnits(detailProject.apr, 0));
    projectDetailObj.totalRaise = totalRaise_temp;
    projectDetailObj.totalYTEST = totalYTEST_temp;
    projectDetailObj.currentStatus = Number((totalYTEST_temp - shareTokenAmount_temp) * 100 / totalYTEST_temp);
    projectDetailObj.endDate = Number(ethers.utils.formatUnits(detailProject.endDate, 0));
    projectDetailObj.ongoingPercent = Number(detailProject.ongoingPercent);
    projectDetailObj.name = detailProject.title;
    projectDetailObj.logoSrc = detailProject.icon;
    projectDetailObj.symbolImage = detailProject.symbolImage;
    projectDetailObj.tokenPrice = Number(ethers.utils.formatUnits(detailProject.shareTokenPrice, 3));
    projectDetailObj.explanation = detailProject.description;

    projectDetailObj.ROI = Number(ethers.utils.formatUnits(detailProject.roi, 0));
    projectDetailObj.category = detailProject.category;
    projectDetailObj.investDecimal = investDecimal_temp;
    projectDetailObj.shareDecimal = shareDecimal_temp;
    projectDetailObj.shareToken = shareTokenAddress;
    projectDetailObj.investToken = investTokenAddress;
    projectDetailObj.projectURL = detailProject.projectWebsite;
    if (connectedAddress) {
      projectDetailObj.claimAmount = Number(ethers.utils.formatUnits(detailProject.claimableAmount, investDecimal_temp));
      projectDetailObj.claimable = detailProject.claimable;
      projectDetailObj.joinState = detailProject.joinState;
      projectDetailObj.investTokenBalance = ethers.utils.formatUnits(detailProject.investTokenBalance, investDecimal_temp);
      projectDetailObj.shareTokenBalance = ethers.utils.formatUnits(detailProject.shareTokenBalance, shareDecimal_temp);
      projectDetailObj.investTokenAllowance = ethers.utils.formatUnits(detailProject.investTokenAllowance, investDecimal_temp);
      projectDetailObj.shareTokenAllowance = ethers.utils.formatUnits(detailProject.shareTokenAllowance, shareDecimal_temp);

      let availableTokenTotalPrice = ((totalYTEST_temp - (projectDetailObj.currentStatus * totalYTEST_temp / 100)) / projectDetailObj.tokenPrice).toFixed(2);
      let maxValue = Number(availableTokenTotalPrice) < Number(projectDetailObj.investTokenBalance) ? availableTokenTotalPrice : projectDetailObj.investTokenBalance;
      projectDetailObj.availableMaxUsdValue = maxValue.toString();
    }

    return projectDetailObj;
  } catch (ex) {
    console.log("project detail info error: ", ex);
  }
}

export const projectInfos = (account: any) => async (dispatch: any) => {
  try {
    const ProjectManagerInstance = new Contract(ProjectManager.address, ProjectManager.abi, rpc_provider_basic);
    const projects = await ProjectManagerInstance.getProjectAllContract();
    const projectsDetail: any[] = [];

    Promise.all(
      projects.map((item: any) => {
        return new Promise(async (resolve) => {
          const projectInfoObj = await projectDetailInfo(item, account);
          projectsDetail.push(projectInfoObj);
          resolve("");
        });
      })
    ).then(() => {
      dispatch({
        type: GET_PROJECT_INFO,
        payload: {
          projects: projectsDetail
        }
      })
    })

  } catch (error) {
    console.log("project infos error: ", error);
  }
};

export const addNewProject = (projectsList: any, newAddress: any, account: any) => async (dispatch: any) => {
  try {
    new Promise(async (resolve) => {
      const projectInfoObj = await projectDetailInfo(newAddress as any, account as any);
      projectsList.push(projectInfoObj);
      resolve('');
    }).then(() => {
      dispatch({
        type: GET_PROJECT_INFO,
        payload: {
          projects: projectsList
        }
      })
    })

  } catch (ex) {
    console.log("new add project error: ", ex)
  }
};

export const updateProjectInfo = (projectList: any, projectAddress: any, account: any) => async (dispatch: any) => {
  try {
    new Promise(async (resolve) => {
      const projectInfoObj = await projectDetailInfo(projectAddress, account);
      projectList.map((item: any, index: any) => {
        if (item.poolAddress == projectAddress) {
          projectList[index] = projectInfoObj;
          return;
        }
      })
      resolve('');
    }).then(() => {
      dispatch({
        type: GET_PROJECT_INFO,
        payload: {
          projects: projectList
        }
      })
    })
  } catch (ex) {
    console.log("update project info error: ", ex);
  }
};

export const getShareTokenBalance = (address: any, account: any) => async (dispatch: any) => {
  try {
    const ProjectManagerInstance = new Contract(ProjectManager.address, ProjectManager.abi, rpc_provider_basic);
    const projects = await ProjectManagerInstance.getProjectAllContract();
    const projectsDetail: any[] = [];

    Promise.all(
      projects.map((item: any) => {
        return new Promise(async (resolve) => {
          const projectInfoObj = await projectDetailInfo(item, account);
          projectsDetail.push(projectInfoObj);
          resolve('');
        });
      })
    ).then(() => {
      dispatch({
        type: GET_PROJECT_INFO,
        payload: {
          projects: projectsDetail
        }
      })
    })

  } catch (error) {
    console.log("project infos error: ", error);
  }
}

export const retireveingFundProject = () => (dispatch: any) => {
  dispatch({
    type: PROJECT_INFO_RETIREVEING
  })
}

export const updateFundProjects = (data: any[]) => (dispatch: any) => {
  dispatch({
    type: PROJECT_INFO_UPDATE,
    payload: {
      data
    }
  })
}

export const updateProjectByProjectAddress = (address: string, data: any, loading: number) => (dispatch: any) => {
  dispatch({
    type: PROJECT_INFO_UPDATE_BY_PROJECT_ADDRESS,
    payload: {
      address: address,
      data: data,
      loading: loading
    }
  })
}

export const errorFundProject = () => (dispatch: any) => {
  dispatch({
    type: PROJECT_INFO_ERROR
  })
}
