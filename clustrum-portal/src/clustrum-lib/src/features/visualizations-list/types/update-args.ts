import { Color } from './color';
import { MeasureType, NullAlias } from './enums';
import {
  Filter,
  Dataset,
  FieldProperties,
} from '@lib-entities/visualization-factory/types';
import { IntRange } from './common-services';
import { VisualizationItem } from './visualization-item';
import { PaginateInfo } from '@lib-shared/types';

export interface CommonSelectionProps {
  dataset: Dataset;
  datasetError: boolean;
  needSteppedLayout: boolean;
  steppedLayoutIndentation: number;
  needAutoNumberingRows: boolean;
  mapLayerOpacity: number;
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
