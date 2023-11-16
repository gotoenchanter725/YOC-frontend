import { useDispatch, useSelector } from "react-redux";
import { retireveingProject, updateProject, errorProject } from "store/actions";
import axiosInstance from "utils/axios";

const useProject = () => {
    const dispatch = useDispatch();
    const [projects, loading, error] = useSelector((state: any) => {
        return [
            state.trade.projects.data,
            state.trade.projects.loading,
            state.trade.projects.error,
        ]
    });

    const projectRetireve = (account: string) => {
        dispatch(retireveingProject() as any);
        axiosInstance.get('/trade/tradeProjects?address=' + account)
            .then((response) => {
                let data: [] = response.data.data;
                projectUpdate(data);
            }).catch((error) => {
                console.log('error while getting projects info', error)
                projectError();
            })
    }

    const projectUpdate = (data: any[]) => {
        dispatch(updateProject(data) as any);
    }

    const projectError = () => {
        dispatch(errorProject() as any);
    }

    return { projects, loading, error, projectRetireve, projectUpdate, projectError };
}

export default useProject;