import useAccount from "@hooks/useAccount";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { retireveingMyOrder, updateMyOrder, errorMyOrder } from "store/actions";
import axiosInstance from "utils/axios";

const useMyOrder = () => {
  const { account } = useAccount();
  const dispatch = useDispatch();
  const [myOrders, myOrderLoading, myOrderError] = useSelector((state: any) => {
    return [
      state.trade.myOrders.data,
      state.trade.myOrders.loading,
      state.trade.myOrders.error,
    ]
  });

  const orderRetireve = useCallback(() => {
    if (account) {
      dispatch(retireveingMyOrder() as any);
      axiosInstance.get(`/trade/tradeOrdersByAddress?address=${account}`)
        .then((response) => {
          let data: [] = response.data.data;
          orderUpdate(data);
        }).catch((error) => {
          console.log('error while getting projects info', error)
          orderError()
        })
    }
  }, [account]);

  const orderUpdate = (data: any[]) => {
    dispatch(updateMyOrder(data) as any);
  }

  const orderError = () => {
    dispatch(errorMyOrder() as any);
  }

  return { myOrders, loading: myOrderLoading, error: myOrderError, orderRetireve };
}

export default useMyOrder;