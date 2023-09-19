import { DndContainerProps, DndItemData } from '@lib-shared/ui/drag-n-drop/types';
import {
  CheckboxProps,
  InputNumberProps,
  SliderSingleProps,
  InputProps,
  SelectProps,
} from 'antd';

export type ContainerProps =
  | DndContainerProps<DndItemData>
  | SliderSingleProps
  | CheckboxProps
  | InputNumberProps
  | InputProps
  | SelectProps;
