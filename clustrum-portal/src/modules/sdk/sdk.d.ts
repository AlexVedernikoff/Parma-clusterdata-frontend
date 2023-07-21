import { CancelToken, CancelTokenSource } from 'axios';
import {
  DashboardControlsData,
  LoadedData,
  DateParams,
} from '@clustrum-lib/shared/ui/filter-controls-factory/types';

interface Params {
  [key: string]: string | string[] | DateParams;
}
export default class SDK {
  static runDashControl(arg0: {
    shared: DashboardControlsData;
    cancelToken: CancelToken;
  }): LoadedData {
    throw new Error('Method not implemented.');
  }
  static runDashChart(arg0: {
    id: string | undefined;
    params: Params;
    cancelToken: CancelToken;
  }): LoadedData {
    throw new Error('Method not implemented.');
  }
  static createCancelSource(): CancelTokenSource {
    throw new Error('Method not implemented.');
  }
  static createDashState(payload: {
    entryId: string;
    data: { params: object };
  }): Promise<{ uuid: string }>;
  static getDashState(payload: {
    uuid: 'string';
  }): Promise<{
    created_at: string;
    data: string;
    entryId: string;
    uuid: string;
  }>;
}
