import { FieldDataType } from './field-data-type';

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
