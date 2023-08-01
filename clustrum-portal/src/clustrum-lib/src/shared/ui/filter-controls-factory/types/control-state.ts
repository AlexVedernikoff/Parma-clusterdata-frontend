import { LoadStatus, LoadedData, LoadedDataScheme } from '../types';

export interface ControlState {
  status: LoadStatus;
  scheme: LoadedDataScheme[] | null;
  loadedData: LoadedData | null;
  usedParams: { [key: string]: string[] } | null;
}
