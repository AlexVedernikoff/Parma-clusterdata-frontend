import { DashboardControlsData } from '@lib-shared/ui/filter-controls-factory/types';
import { CancelToken } from 'axios';

export interface ControlDataProps {
  cancelToken: CancelToken;
  shared: DashboardControlsData;
}

export interface LoadedData {
  uiScheme: LoadedDataScheme[];
  usedParams: LoadedDataUsedParams;
}

export interface LoadedDataUsedParams {
  [key: string]: string[];
}

export interface LoadedDataSchemeContent {
  title: string;
  value: string;
}

export interface LoadedDataScheme {
  content: LoadedDataSchemeContent[];
  dateFormat: string;
  fieldDataType: FieldDataType;
  label: string;
  multiselect: boolean;
  param: string;
  type: string;
}

export enum FieldDataType {
  Long = 'LONG',
  DateTime = 'DATETIME',
  Double = 'DOUBLE',
  Integer = 'INTEGER',
  String = 'STRING',
}
