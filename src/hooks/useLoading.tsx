import { useDispatch } from "react-redux";

import { loading_end, loading_start } from "../../store/actions";

const useLoading = () => {
    const dispatch = useDispatch();

    const loadingStart = () => {
        dispatch(loading_start() as any);
    }

    const loadingEnd = () => {
        dispatch(loading_end() as any);
    }

    return { loadingStart, loadingEnd };
}

export default useLoading;