import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { Contract, ethers } from "ethers";

import useAccount from "./useAccount";
import { retireveingFundProject, updateFundProjects, errorFundProject, updateProjectByProjectAddress } from "store/actions/indexAction";
import { Project, ProjectDetail, ProjectManager, YOC, YUSD } from "src/constants/contracts";
import axiosInstance from "utils/axios";


const useProject = () => {
    const { account, provider } = useAccount();
    const dispatch = useDispatch();
    const [projects, loading, error] = useSelector((state: any) => {
        return [
            state.data.projects.data,
            state.data.projects.loading,
            state.data.projects.error,
        ]
    })

    // useEffect(() => {
    //     (async () => {
    //         if (provider && account && loading == 0) {
    //             console.log("FUNDS", account)
    //             await retireveProjectsDetails();
    //             // console.log("funds-project")
    //         }
    //     })()
    // }, [provider, account, loading])

    const retireveProjectsDetails = useCallback(async () => {
        try {
            const ProjectManagerInstance = new Contract(ProjectManager.address, ProjectManager.abi, provider);
            const projects = await ProjectManagerInstance.getProjectAllContract();
            const projectsDetail: any[] = [];

            dispatch(retireveingFundProject() as any);

            Promise.all(
                projects.map((item: any) => {
                    return new Promise(async (resolve) => {
                        const projectInfoObj = await updateProjectInfoByAddress(item);
                        projectsDetail.push(projectInfoObj);
                        resolve("");
                    });
                })
            ).then(() => {
                console.log('eeeeeeeeeeeeeeeee', projectsDetail);
                if (account) {
                    setTimeout(() => {
                        dispatch(updateFundProjects(projectsDetail) as any);
                    }, 500);
                }
            })
        } catch (error) {
            console.log("project infos error: ", error);
            dispatch(errorFundProject() as any);
        }
    }, [provider, account]);

    const updateProjectInfoByAddress = useCallback(async (address: any) => {
        try {
            dispatch(updateProjectByProjectAddress(
                address,
                {
                    poolAddress: address
                },
                1
            ) as any);
            const detailContract = new Contract(ProjectDetail.address, ProjectDetail.abi, provider);
            let detailProject = await detailContract.getProjectDetails(address, account ? account : "0x0000000000000000000000000000000000000000");

            const projectDetailObj: any = {};
            const shareTokenAddress = detailProject.shareToken.tokenAddress;
            const investTokenAddress = detailProject.investToken.tokenAddress;
            const shareTokenDecimals = Number(ethers.utils.formatUnits(detailProject.shareToken.decimals, 0));
            const totalRaise = Number(ethers.utils.formatUnits(detailProject.project.investTotalAmount, YUSD.decimals));
            const shareTokenSellAmount = Number(ethers.utils.formatUnits(detailProject.shareToken.sellAmount, shareTokenDecimals));
            const shareTokenRemainingBalanceOfProject = Number(ethers.utils.formatUnits(detailProject.shareToken.remainingBalanceOfProject, shareTokenDecimals));
            const shareTokenTotalSupply = Number(ethers.utils.formatUnits(detailProject.shareToken.totalSupply, shareTokenDecimals));

            projectDetailObj.projectContract = new Contract(address, Project.abi, provider);
            projectDetailObj.poolAddress = address;
            projectDetailObj.APR = 0;
            projectDetailObj.totalRaise = totalRaise;
            projectDetailObj.totalYTEST = shareTokenSellAmount;
            projectDetailObj.currentStatus = Number((shareTokenSellAmount - shareTokenRemainingBalanceOfProject) * 100 / shareTokenSellAmount);
            projectDetailObj.endDate = Number(ethers.utils.formatUnits(detailProject.project.endDate, 0));
            projectDetailObj.ongoingPercent = Number(detailProject.project.ongoingPercent);
            projectDetailObj.name = detailProject.project.title;
            projectDetailObj.logoSrc = detailProject.project.icon;
            projectDetailObj.symbolImage = detailProject.project.symbolImage;
            projectDetailObj.tokenPrice = Number(ethers.utils.formatUnits(detailProject.project.shareTokenPrice, 3));
            projectDetailObj.explanation = detailProject.project.description;
            projectDetailObj.multiplier = +detailProject.project.multiplier;
            projectDetailObj.ROI = Number(ethers.utils.formatUnits(detailProject.project.roi, 0));
            projectDetailObj.category = detailProject.project.category;
            projectDetailObj.projectURL = detailProject.project.projectWebsite;
            projectDetailObj.tradePaused = detailProject.project.tradePaused;

            projectDetailObj.investDecimal = YUSD.decimals;
            projectDetailObj.shareDecimal = shareTokenDecimals;
            projectDetailObj.shareSymbol = detailProject.shareToken.symbol;
            projectDetailObj.shareToken = shareTokenAddress;
            projectDetailObj.shareTokenTotalSupply = shareTokenTotalSupply;
            projectDetailObj.investToken = investTokenAddress;
            if (account) {
                console.log(detailProject.project.title, detailProject.profit.joinState, detailProject);
                projectDetailObj.investTokenBalance = ethers.utils.formatUnits(detailProject.investToken.balance, YUSD.decimals);
                projectDetailObj.shareTokenBalance = ethers.utils.formatUnits(detailProject.shareToken.balance, shareTokenDecimals);
                projectDetailObj.investTokenAllowance = ethers.utils.formatUnits(detailProject.investToken.allowance, YUSD.decimals);
                projectDetailObj.shareTokenAllowance = ethers.utils.formatUnits(detailProject.shareToken.allowance, shareTokenDecimals);

                projectDetailObj.claimAmount = Number(ethers.utils.formatUnits(detailProject.profit.claimableAmount, YUSD.decimals));
                projectDetailObj.claimable = detailProject.profit.claimable;
                projectDetailObj.joinState = detailProject.profit.joinState;
                projectDetailObj.investEarnAmount = ethers.utils.formatUnits(detailProject.profit.investEarnAmount, YOC.decimals);


                let availableTokenTotalPrice = ((shareTokenSellAmount - (projectDetailObj.currentStatus * shareTokenSellAmount / 100)) / projectDetailObj.tokenPrice).toFixed(2);
                let maxValue = Number(availableTokenTotalPrice) < Number(projectDetailObj.investTokenBalance) ? availableTokenTotalPrice : projectDetailObj.investTokenBalance;
                projectDetailObj.availableMaxUsdValue = maxValue.toString();
            }
            projectDetailObj.vote = {
                data: [],
                loading: 1
            }
            projectDetailObj.detail = {
                data: {},
                loading: 1
            }
            dispatch(updateProjectByProjectAddress(
                address,
                projectDetailObj,
                2
            ) as any);

            // axiosInstance.get(`/project?ptokenAddress=${detailProject.shareToken}`).then(res => {
            //     let rst = res.data.data;
            //     projectDetailObj.detail = {
            //         data: {
            //             ...rst
            //         },
            //         loading: 2
            //     };
            //     dispatch(updateProjectByProjectAddress(
            //         address,
            //         projectDetailObj,
            //         2
            //     ) as any);
            // })

            // axiosInstance.get(`/voting/projectTitle/${detailProject.title}`).then(res => {
            //     let rst = res.data.votingQueryDetail;
            //     rst = rst.sort((a: any, b: any) => {
            //         return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            //     }).map((item: any) => new Date(item.endDate).getTime() > new Date().getTime() ? { ...item, ongoing: true } : { ...item, ongoing: false })
            //     projectDetailObj.vote = {
            //         data: [
            //             ...rst
            //         ],
            //         loading: 2
            //     };
            //     dispatch(updateProjectByProjectAddress(
            //         address,
            //         projectDetailObj,
            //         2
            //     ) as any);
            // })
            return projectDetailObj;
        } catch (err) {
            console.log("project detail info error: ", err);
        }
    }, [account, provider]);

    return { retireveProjectsDetails, updateProjectInfoByAddress, projects, loading, error };
}

export default useProject;