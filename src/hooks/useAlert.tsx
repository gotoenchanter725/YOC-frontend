import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { alert_show, loading_end, loading_start } from "../../store/actions";

const useAlert = () => {
    const dispatch = useDispatch();

    const alertShow = (data: any) => {
        dispatch(alert_show(data) as any);
    }

    return { alertShow };
}

export default useAlert;