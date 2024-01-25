import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { retireveingCurrency, updateCurrency, errorCurrency } from "store/actions";
import { tokenInterface } from "../constants/tokens";
import axiosInstance from "utils/axios";

const useCurrency = () => {
  const dispatch = useDispatch();
  const [currencies, currencyLoading, error] = useSelector((state: any) => {
    return [
      state.currencyData.data,
      state.currencyData.loading,
      state.currencyData.error,
    ]
  });

  const currencyRetireve = useCallback(() => {
    dispatch(retireveingCurrency() as any);

    // if (currencyResponse && currencyResponse.data && currencyResponse.data.currencies) {
    // 	setCurrencies(currencyResponse.data.currencies.filter((item: any) => item.isActive === true && item.isDelete === false));
    // }
    axiosInstance.get(`/currency/all`)
      .then((response) => {
        let data: [] = response.data.currencies;
        currencyUpdate(data);
      }).catch((error) => {
        console.log('error while getting projects info', error)
        currencyError()
      })
  }, []);

  const currencyUpdate = (data: any[]) => {
    dispatch(updateCurrency(data) as any);
  }

  const currencyError = () => {
    dispatch(errorCurrency() as any);
  }

  const getCurrencyDetail = useCallback((address: string) => {
    let item: tokenInterface = currencies.find(((item: tokenInterface) => item.address == address)) as tokenInterface;
    return item;
  }, [currencies]);


  return { currencies, loading: currencyLoading, error: error, currencyRetireve, getCurrencyDetail };
}

export default useCurrency;