import { ISubTotalsSettings } from './types';
import { VisualizationType } from '@clustrum-lib/entities/visualization-factory/types';

export const getDialogPivotTableFields = (
  placeholderType: string,
): Array<{
  id: keyof ISubTotalsSettings;
  text: string;
  type: VisualizationType;
}> => [
  {
    id: 'needSubTotal',
    text: 'Подытоги',
    type: VisualizationType.CheckBox,
  },
  // {
  //   id: 'showBefore',
  //   text: placeholderType.includes('rows')
  //     ? 'Расположить строку с итогами сверху'
  //     : 'Расположить столбец с итогами слева',
  //   type: VisualizationType.CheckBox,
  // },
  // {
  //   id: 'customName',
  //   text: 'Пользовательское название:',
  //   type: VisualizationType.TextInput,
  // },
];
