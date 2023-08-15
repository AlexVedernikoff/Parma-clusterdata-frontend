import { DashboardControlsData } from '@lib-shared/ui/filter-controls-factory/types';
import { CancelToken } from 'axios';

export interface DataProps {
  cancelToken: CancelToken;
  shared: DashboardControlsData;
}
