export enum DefaultValueType {
  Relative = 'relative',
  Date = 'date',
  NoDefined = 'noDefined',
  DefaultRanges = 'defaultRanges',
}

export interface DateParamsValue {
  from: string;
  to: string;
}

export interface DateParams {
  type: DefaultValueType;
  value: DateParamsValue;
}
