import axios, { AxiosRequestConfig } from 'axios';
import ENV from 'ENV';
import { ControlDataProps, LoadedData } from './dto';

export const getDashboardControlRequest = (
  data: ControlDataProps,
): Promise<LoadedData> => {
  const requestConfig: AxiosRequestConfig = {
    method: 'post',
    url: `${ENV.biHost}/runDashControl`,
    data,
  };

  return axios(requestConfig).then(response => response.data);
};
