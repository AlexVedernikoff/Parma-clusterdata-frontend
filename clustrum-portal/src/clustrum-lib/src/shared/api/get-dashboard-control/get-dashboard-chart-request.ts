import config from 'config';
import { DataProps } from './dto/get-dashboard-chart-dto';
import { AxiosRequestConfig } from 'axios';

export const getDashboardChartRequest = (data: DataProps): AxiosRequestConfig => {
  return {
    method: 'post',
    url: `${config.biHost}/runDashChart`,
    data,
  };
};
