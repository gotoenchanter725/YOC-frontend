import { useState, useEffect } from "react";
import axios from "axios";
import { tokenInterface } from "../constants/tokens";

const useCurrency = () => {
    const [tokens, setTokens] = useState<tokenInterface[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(process.env.API_ADDRESS + '/currency/all');
                setTokens(response.data.currencies)
            } catch (error) {
                setError(error as any);
            }

            setIsLoading(true);
        })();
    }, [])

    return { tokens, isLoading, error };
}

const useLiquidityPools = () => {
    const [tokens, setTokens] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(process.env.API_ADDRESS + '/liquidity/all');
                setTokens(response.data)
            } catch (error) {
                setError(error as any);
            }

            setIsLoading(true);
        })();
    }, [])

    return { tokens, isLoading, error };
}

export {
    useCurrency,
    useLiquidityPools
}