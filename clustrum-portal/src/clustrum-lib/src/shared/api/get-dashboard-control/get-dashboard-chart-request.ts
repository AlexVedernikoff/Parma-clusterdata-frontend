import axios, { AxiosRequestConfig } from 'axios';
import ENV from 'ENV';
import { ChartDataProps, LoadedData } from './dto';

export const getDashboardChartRequest = (data: ChartDataProps): Promise<LoadedData> => {
  const requestConfig: AxiosRequestConfig = {
    method: 'post',
    url: `${ENV.biHost}/runDashChart`,
    data,
  };

  return axios(requestConfig).then(response => response.data);
};
