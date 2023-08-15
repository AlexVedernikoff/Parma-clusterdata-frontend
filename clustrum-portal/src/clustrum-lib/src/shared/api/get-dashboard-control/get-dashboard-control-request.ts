import config from 'config';
import { DataProps } from './dto/get-dashboard-control-dto';
import { AxiosRequestConfig } from 'axios';

export const getDashboardControlRequest = (data: DataProps): AxiosRequestConfig => {
  return {
    method: 'post',
    url: `${config.biHost}/runDashControl`,
    data,
  };
};
