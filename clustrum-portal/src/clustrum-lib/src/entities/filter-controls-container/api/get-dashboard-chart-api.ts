import { CancelToken } from 'axios';
import { getDashboardChartRequest } from '@lib-shared/api/get-dashboard-control';
import { DateParams, LoadedData } from '@lib-shared/ui/filter-controls-factory/types';

export interface Params {
  [key: string]: string | string[] | DateParams;
}

export interface ChartDataProps {
  cancelToken: CancelToken;
  id: string | undefined;
  params: Params;
}

export const getDashboardChartApi = async (data: ChartDataProps): Promise<LoadedData> => {
  return getDashboardChartRequest(data);
};
