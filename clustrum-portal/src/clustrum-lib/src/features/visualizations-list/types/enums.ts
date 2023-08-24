import { WIZARD_ITEM_TYPES } from '@lib-shared/config/wizard-item-types';

export enum FieldAggregation {
  None = 'none',
  Average = 'avg',
  Count = 'count',
  CountUnique = 'countunique',
  Max = 'max',
  Min = 'min',
  Sum = 'sum',
  UniqueArray = 'uniquearray',
}

export enum MeasureType {
  Absolute = 'absolute',
  Relative = 'relative',
  Empty = 'empty',
}

export enum NullAlias {
  Null = 'null',
  Empty = 'empty',
  Dash = 'dash',
  NoData = 'no-data',
  Undefined = 'undefined',
  Zero = 'zero',
}

export type ItemTypes = typeof WIZARD_ITEM_TYPES;

export enum DatasetMode {
  Direct = 'direct',
  Materialized = 'materialized',
  MaterializedByPeriod = 'materialized_by_period',
}

export enum ChartId {
  Line = 'line',
  Area = 'area',
  Column = 'column',
  Pie = 'pie',
  FlatTable = 'flatTable',
}
