import axios from 'axios';
import { DataProps } from '@lib-shared/api/get-dashboard-control/dto/get-dashboard-chart-dto';
import { getDashboardChartRequest } from '@lib-shared/api/get-dashboard-control';
import { LoadedData } from '@lib-shared/ui/filter-controls-factory/types';

export const getDashboardChartApi = async (data: DataProps): Promise<LoadedData> => {
  const requestConfig = await getDashboardChartRequest(data);

  return axios(requestConfig).then(response => response.data);
};
