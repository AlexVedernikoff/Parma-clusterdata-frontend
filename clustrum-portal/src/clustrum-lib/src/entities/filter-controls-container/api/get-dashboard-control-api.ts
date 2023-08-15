import axios from 'axios';
import { DataProps } from '@lib-shared/api/get-dashboard-control/dto/get-dashboard-control-dto';
import { getDashboardControlRequest } from '@lib-shared/api/get-dashboard-control';
import { LoadedData } from '@lib-shared/ui/filter-controls-factory/types';

export const getDashboardControlApi = async (data: DataProps): Promise<LoadedData> => {
  const requestConfig = await getDashboardControlRequest(data);

  return axios(requestConfig).then(response => response.data);
};
