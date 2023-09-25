import { Dispatch, SetStateAction } from 'react';
import { CastIconType } from '@clustrum-lib/shared/ui/cast-icons-factory/types';
import { schema } from '@kamatech-data-ui/clustrum-core-plugins/components/schema';
import { Toaster } from '@kamatech-data-ui/common/src';

export interface ISubTotalsSettings {
  needSubTotal?: boolean;
  showBefore?: boolean;
  formula?: string;
  customName?: string;
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
  placeholderType: string;
}
export interface MainDialogPivotTableFieldsProps<T> extends DialogPivotTableProps<T> {
  subTotalsSettings: ISubTotalsSettings;
  setSubTotalsSettings: Dispatch<SetStateAction<ISubTotalsSettings>>;
  clearFormulaField: () => void;
  setFormulaError: Dispatch<SetStateAction<RejectFormulaError | null>>;
}

export interface RejectFormulaError {
  response: {
    data: {
      message: string;
    };
  };
}
