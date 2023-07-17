export enum LoadStatus {
  Pending = 'pending',
  Success = 'success',
  Fail = 'fail',
}

export enum DefaultValueType {
  Relative = 'relative',
  Date = 'date',
  NoDefined = 'noDefined',
  DefaultRanges = 'defaultRanges',
}

interface DateParamsValue {
  from: string;
  to: string;
}

export interface DateParams {
  type: DefaultValueType;
  value: DateParamsValue;
}

interface DashboardControlsDataDataset {
  id: string;
  fieldId: string;
}

interface DashboardControlsDataExternal {
  entryId: string;
}

interface DashboardControlsDataControl {
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

interface ParamsKeyAvailableItems {
  [key: string]: string;
}

interface DefaultsParams {
  [key: string]: string;
}

interface ParamsKeyInitiatorItem {
  availableItems: ParamsKeyAvailableItems;
  data: DashboardControlsData;
  id: string;
  namespace: string;
  type: string;
  defaults: DefaultsParams;
}

interface ParamsKey {
  initiatorItem: ParamsKeyInitiatorItem;
  value: string | string[];
}

export interface ParamsProps {
  [key: string]: ParamsKey;
}

interface PaginateInfo {
  page: number;
  pageSize: number;
}

interface OnChangeParams {
  [key: string]: string | string[];
}

export interface DashboardControlsProps {
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
}

export enum FieldDataType {
  Long = 'LONG',
  DateTime = 'DATETIME',
  Double = 'DOUBLE',
  Integer = 'INTEGER',
  String = 'STRING',
}

interface LoadedDataSchemeContent {
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

interface LoadedDataUsedParams {
  [key: string]: string[];
}

export interface LoadedData {
  uiScheme: LoadedDataScheme[];
  usedParams: LoadedDataUsedParams;
}

export enum ControlType {
  Select = 'select',
  Input = 'input',
  Datepicker = 'datepicker',
  RangeDatepicker = 'range-datepicker',
}

export enum PlacementPosition {
  BottomRight = 'bottomRight',
  BottomLeft = 'bottomLeft',
}
