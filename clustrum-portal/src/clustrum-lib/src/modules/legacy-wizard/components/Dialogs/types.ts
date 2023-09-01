import { CastIconType } from '@clustrum-lib/shared/ui/cast-icons-factory/types';
import { schema } from '@kamatech-data-ui/clustrum-core-plugins/components/schema';

export interface ISubTotalsSettings {
  needSubTotal?: boolean;
  formula?: string;
}

export interface IItem {
  title: string;
  cast: CastIconType;
  type: string;
  subTotalsSettings?: ISubTotalsSettings;
  formula: string;
  datasetId: string;
  guid: string;
}

export interface DialogPivotTableProps<T> {
  item: T;
  callback: (item: IItem) => void;
  sdk: typeof schema;
  fields: T[];
  aceModeUrl: string;
}
