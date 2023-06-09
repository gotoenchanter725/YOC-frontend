import { GET_PROJECT_INFO, LOADING_END, LOADING_START, WALLET_CONNECT, WALLET_DISCONNECT } from "../types";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
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

export const walletConnect = () => async (dispatch: any) => {
  try {
    const providerOptions = {
      injected: {
        display: {
          name: "Metamask",
        },
        package: WalletConnectProvider,
      },
      walletconnect: {
        display: {
          name: "WalletConnect",
        },
        package: WalletConnectProvider,
        options: {
          rpc: {
            1: NETWORK.mainnet.RPC_URL,
            5: NETWORK.testnet.RPC_URL
          }
        }
      },
      // 'custom-walletlink': {
      //   display: {
      //     logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
      //     name: 'Coinbase',
      //     description: 'Connect to Coinbase Wallet (not Coinbase App)',
      //   },
      //   options: {
      //     appName: 'Coinbase', // Your app name
      //     networkUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
      //     chainId: 1,
      //   },
      //   package: WalletLink,
      //   connector: async (_, options) => {
      //     const { appName, networkUrl, chainId } = options
      //     const walletLink = new WalletLink({
      //       appName,
      //     })
      //     const provider = walletLink.makeWeb3Provider(networkUrl, chainId)
      //     await provider.enable()
      //     return provider
      //   },
      // },
    };

    web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions,
      disableInjectedProvider: false,
      theme: {
        background: "#081e1a",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "#0b4e42b3",
      },
    });

    const instance = await web3Modal.connect();

    if (Number(instance.chainId) !== Number(process.env.env === "development" ? NETWORK.testnet.CHAIN_ID : NETWORK.mainnet.CHAIN_ID)) {
      try {
        await window.web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${Number(process.env.env === "development" ? NETWORK.testnet.CHAIN_ID : NETWORK.mainnet.CHAIN_ID).toString(16)}` }]
        });
      } catch (error: any) {
        alert(error.message);
      }
      return;
    }

    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();
    const account = await signer.getAddress();

    let YOCContract = new Contract(
      YOC.address,
      TokenTemplate.abi,
      rpc_provider_basic
    )
    let balance = Number(convertWeiToEth(await YOCContract.balanceOf(account), YOC.decimals));

    provider.on("disconnect", () => {
      dispatch(walletDisconnect())
    });

    provider.on("accountsChanged", (accounts) => {
      dispatch(walletConnect())
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
      dispatch(walletConnect())
      console.log(chainId);
    });

    localStorage.setItem('account', account);

    dispatch({
      type: WALLET_CONNECT,
      payload: {
        account: account,
        balance: balance,
        provider: provider,
        chainId: instance.chainId,
        signer: signer,
        rpc_provider: rpc_provider_basic
      }
    })

    dispatch(projectInfos(account));

  } catch (error) {
    console.log("Wallet Connect error: ", error)
  }
}

export const walletDisconnect = () => async (dispatch: any) => {
  try {
    await web3Modal.clearCachedProvider();
    localStorage.setItem('account', '');
    dispatch({
      type: WALLET_DISCONNECT,
      payload: {
        account: undefined,
        provider: undefined,
        chainId: undefined,
        signer: undefined,
        rpc_provider: undefined
      }
    })
    dispatch(projectInfos(undefined));
  } catch (error) {
    console.log("Wallet Disconnect error: ", error)
  }
}

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