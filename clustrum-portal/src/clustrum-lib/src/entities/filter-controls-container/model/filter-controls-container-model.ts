import axios, { CancelTokenSource } from 'axios';
import { ControlSourceType } from '@lib-shared/types';
import {
  ActualParamsReturnType,
  DashboardControlsData,
  LoadedData,
} from '@lib-shared/ui/filter-controls-factory/types';
import { getDashboardChartApi, getDashboardControlApi } from '../api';

export const filterControlsContainerModel = async (
  data: DashboardControlsData,
  actualParams: () => ActualParamsReturnType,
): Promise<LoadedData> => {
  const createCancelSource = (): CancelTokenSource => axios.CancelToken.source();

  const cancelToken = await createCancelSource().token;

  const loadedData: LoadedData =
    data.sourceType === ControlSourceType.External
      ? await getDashboardChartApi({
          id: data.external?.entryId,
          params: actualParams(),
          cancelToken,
        })
      : await getDashboardControlApi({ shared: data, cancelToken });

  return loadedData;
};
