import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { Contract, ethers } from "ethers";

import useAccount from "./useAccount";
import { retireveingFundProject, updateFundProjects, errorFundProject, updateProjectByProjectAddress } from "store/actions/indexAction";
import { Project, ProjectDetail, ProjectManager } from "src/constants/contracts";


const useProject = () => {
    const { account, rpc_provider } = useAccount();
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
    //         if (rpc_provider && account && loading == 0) {
    //             console.log("FUNDS", account)
    //             await retireveProjectsDetails();
    //             // console.log("funds-project")
    //         }
    //     })()
    // }, [rpc_provider, account, loading])

    const retireveProjectsDetails = useCallback(async () => {
        try {
            const ProjectManagerInstance = new Contract(ProjectManager.address, ProjectManager.abi, rpc_provider);
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
    }, [rpc_provider, account]);

    const updateProjectInfoByAddress = useCallback(async (address: any) => {
        try {
            dispatch(updateProjectByProjectAddress(
                address,
                {
                    poolAddress: address
                },
                1
            ) as any);
            const detailContract = new Contract(ProjectDetail.address, ProjectDetail.abi, rpc_provider);
            let detailProject = await detailContract.getProjectDetails(address, account ? account : "0x0000000000000000000000000000000000000000");

            const projectDetailObj: any = {};
            const shareTokenAddress = detailProject.shareToken;
            const investTokenAddress = detailProject.investToken;
            const shareDecimal_temp = Number(ethers.utils.formatUnits(detailProject.shareTokenDecimals, 0));
            const investDecimal_temp = Number(ethers.utils.formatUnits(detailProject.investTokenDecimals, 0));
            const totalRaise_temp = Number(ethers.utils.formatUnits(detailProject.investTotalAmount, investDecimal_temp));
            const totalYTEST_temp = Number(ethers.utils.formatUnits(detailProject.shareTokenSellAmount, shareDecimal_temp));
            const shareTokenAmount_temp = Number(ethers.utils.formatUnits(detailProject.shareTokenBalanceTemp, shareDecimal_temp));

            projectDetailObj.projectContract = new Contract(address, Project.abi, rpc_provider);
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
            projectDetailObj.shareSymbol = detailProject.shareTokenSymbol;
            projectDetailObj.shareToken = shareTokenAddress;
            projectDetailObj.investToken = investTokenAddress;
            projectDetailObj.projectURL = detailProject.projectWebsite;
            if (account) {
                console.log(detailProject.title, detailProject.joinState);
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

            dispatch(updateProjectByProjectAddress(
                address,
                projectDetailObj,
                2
            ) as any);
            return projectDetailObj;
        } catch (err) {
            console.log("project detail info error: ", err);
        }
    }, [account, rpc_provider]);

    return { retireveProjectsDetails, updateProjectInfoByAddress, projects, loading, error };
}

export default useProject;