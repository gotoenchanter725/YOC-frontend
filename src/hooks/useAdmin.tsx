import { useMemo } from "react";

import useAccount from "./useAccount";

import { AdminWalletAddress } from "../constants/contracts";

const useAdmin = () => {
    const { account } = useAccount();

    const isAdmin = useMemo(() => {
        return account && String(account).toUpperCase() === String(AdminWalletAddress).toUpperCase()
    }, [account, AdminWalletAddress])

    return isAdmin;
}

export default useAdmin;