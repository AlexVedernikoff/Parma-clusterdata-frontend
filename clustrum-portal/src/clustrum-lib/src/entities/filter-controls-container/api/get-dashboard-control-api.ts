import { CancelToken } from 'axios';
import { getDashboardControlRequest } from '@lib-shared/api/get-dashboard-control';
import {
  DashboardControlsData,
  LoadedData,
} from '@lib-shared/ui/filter-controls-factory/types';

export interface ControlDataProps {
  cancelToken: CancelToken;
  shared: DashboardControlsData;
}

export const getDashboardControlApi = async (
  data: ControlDataProps,
): Promise<LoadedData> => {
  return getDashboardControlRequest(data);
};
