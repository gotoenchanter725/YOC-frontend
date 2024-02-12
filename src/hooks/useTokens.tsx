import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { tokenInterface } from "../constants/tokens";

const useCurrency = () => {
    const [tokens, setTokens] = useState<tokenInterface[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(process.env.API_ADDRESS + '/currency/all');
                setIsLoading(false);
                setTokens(response.data.currencies)
            } catch (error) {
                setError(error as any);
                setIsLoading(false);
            }

        })();
    }, [])

    const getCurrencyDetail = useCallback((address: string) => {
        let item: tokenInterface = tokens.find((item => item.address == address)) as tokenInterface;
        return item;
    }, [tokens]);

    return { tokens, getCurrencyDetail, isLoading, error };
}

const useLiquidityPools = () => {
    const [tokens, setTokens] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(process.env.API_ADDRESS + '/liquidity/all');
                setIsLoading(false);
                setTokens(response.data)
            } catch (error) {
                setIsLoading(false);
                setError(error as any);
            }

        })();
    }, [])

    return { tokens, isLoading, error };
}

export {
    useCurrency,
    useLiquidityPools
}