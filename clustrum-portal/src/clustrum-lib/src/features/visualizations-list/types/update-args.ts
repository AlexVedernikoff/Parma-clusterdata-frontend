import { Color } from './color';
import { Dataset } from './dataset';
import { MeasureType, NullAlias } from './enums';
import { FieldProperties } from './field-properties';
import { Filter } from './filter';
import { IntRange } from './common-services';
import { VisualizationItem } from './visualization-item';
import { PaginateInfo } from '@lib-shared/types';

export interface CommonSelectionProps {
  dataset: Dataset;
  dimensions: FieldProperties[];
  measures: FieldProperties[];
  visualization: VisualizationItem;
  filters: Filter[];
  coordType: string;
  titleLayerSource: string;
  clusterPrecision: IntRange<0, 18>;
  updates: unknown;
  nullAlias: NullAlias;
  needTotal: boolean;
  needUniqueRows: boolean;
  paginateInfo: PaginateInfo;
  diagramMagnitude: MeasureType;
  exportLimit: number;
}

export interface UpdateArgs extends CommonSelectionProps {
  colors: Color[];
  sort: unknown;
}

export interface VisualizationKind {
  visualizationKind: VisualizationItem;
}
