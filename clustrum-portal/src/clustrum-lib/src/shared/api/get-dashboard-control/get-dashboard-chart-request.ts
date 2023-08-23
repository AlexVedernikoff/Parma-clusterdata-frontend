import axios, { AxiosRequestConfig } from 'axios';
import { ChartDataProps, LoadedData } from './dto';

export const getDashboardChartRequest = (data: ChartDataProps): Promise<LoadedData> => {
  const requestConfig: AxiosRequestConfig = {
    method: 'post',
    url: `${process.env.REACT_APP_CLUSTRUM_BI_HOST}/runDashChart`,
    data,
  };

  return axios(requestConfig).then(response => response.data);
};
