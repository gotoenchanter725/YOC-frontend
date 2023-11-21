import {
  PROJECT_INFO_RETIREVEING,
  PROJECT_INFO_UPDATE,
  PROJECT_INFO_UPDATE_BY_PROJECT_ADDRESS,
  PROJECT_INFO_ERROR
} from "../types";

export const retireveingFundProject = () => (dispatch: any) => {
  dispatch({
    type: PROJECT_INFO_RETIREVEING
  })
}

export const updateFundProjects = (data: any[]) => (dispatch: any) => {
  dispatch({
    type: PROJECT_INFO_UPDATE,
    payload: {
      data
    }
  })
}

export const updateProjectByProjectAddress = (address: string, data: any, loading: number) => (dispatch: any) => {
  dispatch({
    type: PROJECT_INFO_UPDATE_BY_PROJECT_ADDRESS,
    payload: {
      address: address,
      data: data,
      loading: loading
    }
  })
}

export const errorFundProject = () => (dispatch: any) => {
  dispatch({
    type: PROJECT_INFO_ERROR
  })
}
