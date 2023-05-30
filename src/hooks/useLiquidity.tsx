import axios from "axios";
import { useEffect, useState } from "react";
import useAccount from "./useAccount";

const useUserLiquidity = () => {
    const [liquidities, setLiquidities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { account } = useAccount();

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
    }, [account])

    return { liquidities, isLoading, error };
}

export {
    useUserLiquidity
}