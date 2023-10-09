import { DndItemType } from '@lib-entities/visualization-factory/types';
import { Color } from './color';
import { ChartId } from './enums';
import { Placeholder } from './placeholder';
export interface VisualizationItem {
  id: ChartId;
  type: string;
  name: string;
  wizardNodeType: string;
  icon: JSX.Element;
  allowFilters: boolean;
  allowColors: boolean;
  allowCoordType: boolean;
  allowClusterPrecision: boolean;
  allowSort: boolean;
  allowTitleLayerSource: boolean;
  allowUniqueRows: boolean;
  allowTotal: boolean;
  allowSteppedLayout: boolean;
  allowAutoNumberingRows: boolean;
  allowDiagramMagnitude: boolean;
  allowMapLayerOpacity: boolean;
  allowNullAlias: boolean;
  colorsCapacity: number;
  checkAllowedSort: (
    item: DndItemType,
    visualization: VisualizationItem,
    colors?: Color[],
  ) => boolean;
  checkAllowedColors: (item: DndItemType, visualization: VisualizationItem) => void;
  onColorsChange: () => void;
  placeholders: Placeholder[];
  colors: Color[];
  sort: unknown[];
}
