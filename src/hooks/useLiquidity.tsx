import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import useAccount from "./useAccount";

const useUserLiquidity = () => {
    const [liquidities, setLiquidities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { account } = useAccount();
    const [reload, setReload] = useState(0);

    useEffect(() => {
        if (!account) return;
        (async () => {
            try {
                setIsLoading(true);
                let response = await axios.get(process.env.API_ADDRESS + '/liquidity/user?' + `address=${account}`);
                setIsLoading(false);
                setLiquidities(response.data.liquidityData)
            } catch (error) {
                setError(error as any);
            }

        })();
    }, [account, reload])

    const loadLiquidityPools = useCallback(() => {
        setReload(reload + 1);
    }, [reload, setReload])

    return { liquidities, loadLiquidityPools, isLoading, error };
}

export {
    useUserLiquidity
}