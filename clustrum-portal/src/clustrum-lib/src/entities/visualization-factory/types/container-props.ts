import { DndContainerProps, DndItemData } from '@lib-shared/ui/drag-n-drop/types';
import { KamatechRangePicker } from '../../../../../../kamatech_modules/kamatech-ui/components/KamatechRangePicker/KamatechRangePicker.interface';

//TODO Добавить остальные типы вмсесто object после перевода на Ant 711988
export type ContainerProps =
  | DndContainerProps<DndItemData>
  | KamatechRangePicker
  | object;
