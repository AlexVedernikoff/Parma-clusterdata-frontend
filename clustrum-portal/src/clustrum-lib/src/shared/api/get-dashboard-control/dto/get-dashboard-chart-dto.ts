import { DateParams } from '@lib-shared/ui/filter-controls-factory/types';
import { CancelToken } from 'axios';

export interface Params {
  [key: string]: string | string[] | DateParams;
}

export interface ChartDataProps {
  cancelToken: CancelToken;
  id: string | undefined;
  params: Params;
}
