import { DndItemType } from './dnd-item-type';
import { DndContainerProps } from '@lib-shared/ui/drag-n-drop/types';
import {
  CheckboxProps,
  InputNumberProps,
  SliderSingleProps,
  InputProps,
  SelectProps,
} from 'antd';

export type ContainerProps =
  | DndContainerProps<DndItemType>
  | SliderSingleProps
  | CheckboxProps
  | InputNumberProps
  | InputProps
  | SelectProps;
