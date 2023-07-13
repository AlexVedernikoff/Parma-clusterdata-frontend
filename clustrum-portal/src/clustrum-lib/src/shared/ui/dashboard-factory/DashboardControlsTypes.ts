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

export interface DateParams {
  type: DefaultValueType;
  value: { from: string; to: string };
}

export interface DashboardControlsData {
  control: { elementType: string; multiselectable: boolean; isRange: boolean };
  dataset: { id: string; fieldId: string };
  external: {
    entryId: string;
  } | null;
  id: string;
  itemId: string;
  showTitle: false;
  sourceType: string;
  title: string;
}

export interface ParamsProps {
  [key: string]: {
    initiatorItem: {
      availableItems: { [key: string]: string };
      data: DashboardControlsData;
      id: string;
      namespace: string;
      type: string;
      defaults: { [key: string]: string };
    };
    value: string | string[];
  };
}

export interface DashboardControlsProps {
  context: undefined;
  data: DashboardControlsData;
  defaults: { [key: string]: string };
  height: number;
  id: string;
  namespace: string;
  onStateAndParamsChange(stateAndParams: {
    params: { [key: string]: string | string[] } | string;
  }): void;
  orderBy: null | string;
  ownWidgetParams: Map<string, string[]>;
  paginateInfo: { page: number; pageSize: number };
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

export interface LoadedDataScheme {
  content: {
    title: string;
    value: string;
  }[];
  dateFormat: string;
  fieldDataType: FieldDataType;
  label: string;
  multiselect: boolean;
  param: string;
  type: string;
}

export interface LoadedData {
  uiScheme: LoadedDataScheme[];
  usedParams: {
    [key: string]: string[];
  };
}

export enum ControlType {
  Select = 'select',
  Input = 'input',
  Datepicker = 'datepicker',
  RangeDatepicker = 'range-datepicker',
}
