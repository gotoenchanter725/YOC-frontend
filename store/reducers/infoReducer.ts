import { GET_PROJECT_INFO, WALLET_CONNECT, WALLET_DISCONNECT, WALLET_UPDATE, WALLET_MODAL_SHOW, WALLET_MODAL_HIDE } from "../types";

const initialState = {
  account: undefined,
  balance: undefined,
  provider: undefined,
  signer: undefined,
  chainId: undefined,
  projects: [],
  isShowWalletModal: false
};

const getInfo = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_PROJECT_INFO:
    case WALLET_CONNECT:
    case WALLET_DISCONNECT:
    case WALLET_UPDATE:
      return {
        ...state,
        ...action.payload
      };
    case WALLET_MODAL_SHOW:
      return {
        ...state,
        isShowWalletModal: true
      }
    case WALLET_MODAL_HIDE:
      return {
        ...state,
        isShowWalletModal: false
      }

    default:
      return state;
  }
};

export default getInfo;
