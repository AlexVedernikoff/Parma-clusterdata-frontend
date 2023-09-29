import { ISubTotalsSettings } from './types';
import { VisualizationType } from '@clustrum-lib/entities/visualization-factory/types';

export const pivotTableDialogFields = (
  placeholderType: string,
  needSubTotal: boolean | undefined,
): Array<{
  id: keyof ISubTotalsSettings;
  text: string;
  type: VisualizationType;
  visible: boolean;
}> => [
  {
    id: 'needSubTotal',
    text: 'Подытоги',
    type: VisualizationType.CheckBox,
    visible: true,
  },
  {
    id: 'showBefore',
    text: placeholderType.includes('rows')
      ? 'Расположить строку с итогами сверху'
      : 'Расположить столбец с итогами слева',
    type: VisualizationType.CheckBox,
    visible: needSubTotal === true,
  },
  {
    id: 'customName',
    text: 'Пользовательское название:',
    type: VisualizationType.TextInput,
    visible: false,
  },
];
