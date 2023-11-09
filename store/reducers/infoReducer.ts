import {
  PROJECT_INFO_RETIREVEING,
  PROJECT_INFO_UPDATE,
  PROJECT_INFO_UPDATE_BY_PROJECT_ADDRESS,
  PROJECT_INFO_ERROR,
  WALLET_CONNECT,
  WALLET_DISCONNECT,
  WALLET_UPDATE,
  WALLET_MODAL_SHOW,
  WALLET_MODAL_HIDE
} from "../types";

const initialState = {
  account: undefined,
  balance: undefined,
  provider: undefined,
  signer: undefined,
  chainId: undefined,
  projects: {
    data: [],
    loading: 0,
    error: false
  },
  isShowWalletModal: false
};

const infoReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case PROJECT_INFO_RETIREVEING:
      return {
        ...state,
        projects: {
          data: [
            ...state.projects.data
          ],
          loading: 1
        }
      }
    case PROJECT_INFO_UPDATE:
      return {
        ...state,
        projects: {
          data: [
            ...action.payload.data
          ],
          loading: state.projects.loading + 1
        }
      }
    case PROJECT_INFO_UPDATE_BY_PROJECT_ADDRESS:
      const projectAddress = action.payload.address;
      const index = state.projects.data.findIndex((item: any) => item.poolAddress == projectAddress);
      let projects: any[] = state.projects.data;
      projects[index == -1 ? projects.length : index] = action.payload.data;
      return {
        ...state,
        projects: {
          data: [
            ...projects
          ],
          loading: action.payload.loading
        }
      }
    case PROJECT_INFO_ERROR:
      return {
        ...state,
        projects: {
          data: [
            ...state.projects.data
          ],
          loading: 2,
          error: true
        }
      }
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

export default infoReducer;
