import { MeasureType, NullAlias } from './enums';
import {
  Filter,
  Dataset,
  FieldProperties,
} from '@lib-entities/visualization-factory/types';
import { IntRange } from './common-services';
import { PaginateInfo } from '@lib-shared/types';

export interface UpdatePreviewParams {
  nullAlias: NullAlias;
  needTotal: boolean;
  needUniqueRows: boolean;
  paginateInfo: PaginateInfo;
  exportLimit: number;
  coordType: string;
  titleLayerSource: string;
  clusterPrecision: IntRange<0, 18>;
  diagramMagnitude: MeasureType;
  dataset: Dataset;
  filters: Filter[];
  dimensions: FieldProperties[];
  measures: FieldProperties[];
  updates: unknown[];
}
