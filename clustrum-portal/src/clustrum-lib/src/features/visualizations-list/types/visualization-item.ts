import { Color } from './color';
import { ChartId } from './enums';
import { FieldProperties } from './field-properties';
import { Placeholder } from './placeholder';
export interface VisualizationItem {
  id: ChartId;
  type: string;
  name: string;
  wizardNodeType: string;
  icon: JSX.Element;
  allowFilters: boolean;
  allowColors: boolean;
  allowSort: boolean;
  colorsCapacity: number;
  allowNullAlias: boolean;
  checkAllowedSort: (item: FieldProperties, visualization: VisualizationItem) => void;
  checkAllowedColors: (item: FieldProperties, visualization: VisualizationItem) => void;
  onColorsChange: () => void;
  placeholders: Placeholder[];
  colors: Color[];
  sort: unknown[];
}
