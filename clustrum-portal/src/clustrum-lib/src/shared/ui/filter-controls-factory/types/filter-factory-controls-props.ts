import { ActualParamsReturnType, DateParams, LoadedDataScheme } from '../types';

export interface DashboardControlsDataDataset {
  id: string;
  fieldId: string;
}

export interface DashboardControlsDataExternal {
  entryId: string;
}

export interface DashboardControlsDataControl {
  elementType: string;
  multiselectable: boolean;
  isRange: boolean;
}

export interface DashboardControlsData {
  control: DashboardControlsDataControl;
  dataset: DashboardControlsDataDataset;
  external: DashboardControlsDataExternal | null;
  id: string;
  itemId: string;
  showTitle: false;
  sourceType: string;
  title: string;
}

export interface ParamsKeyAvailableItems {
  [key: string]: string | string[] | DateParams;
}

export interface DefaultsParams {
  [key: string]: string;
}

export interface ParamsKeyInitiatorItem {
  availableItems: ParamsKeyAvailableItems;
  data: DashboardControlsData;
  id: string;
  namespace: string;
  type: string;
  defaults: DefaultsParams;
}

export interface ParamsKey {
  initiatorItem: ParamsKeyInitiatorItem;
  value: string | string[];
}

export interface ParamsProps {
  [key: string]: ParamsKey;
}

export interface PaginateInfo {
  page: number;
  pageSize: number;
}

export interface OnChangeParams {
  [key: string]: string | string[];
}

export interface FilterControlsFactoryProps {
  context: undefined;
  data: DashboardControlsData;
  defaults: DefaultsParams;
  height: number;
  id: string;
  namespace: string;
  onStateAndParamsChange(stateAndParams: { params: OnChangeParams | string }): void;
  orderBy: null | string;
  ownWidgetParams: Map<string, string[]>;
  paginateInfo: PaginateInfo;
  params: ParamsProps;
  width: number;
  scheme: LoadedDataScheme[] | null;
  getActualParams(): ActualParamsReturnType;
}

export interface LabelWithHoverProps {
  label: string;
}
