import axios, { AxiosRequestConfig } from 'axios';
import { ControlDataProps, LoadedData } from './dto';

export const getDashboardControlRequest = (
  data: ControlDataProps,
): Promise<LoadedData> => {
  const requestConfig: AxiosRequestConfig = {
    method: 'post',
    url: `${process.env.REACT_APP_CLUSTRUM_BI_HOST}/runDashControl`,
    data,
  };

  return axios(requestConfig).then(response => response.data);
};
