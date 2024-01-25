import { useCallback, useEffect, useState } from "react";
import axiosInstance from "utils/axios";

const useServer = () => {
  const [time, setTime] = useState({
    time: 0,
    timezone: "",
    value: ""
  });

  const getTime = useCallback(async () => {
    let res = await axiosInstance('/project/time');
    setTime(res.data.data);
    return
  }, []);

  return { time, getTime };
}

export default useServer;