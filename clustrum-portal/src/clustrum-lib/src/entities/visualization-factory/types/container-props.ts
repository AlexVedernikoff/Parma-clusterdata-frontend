import { DndContainerProps, DndItemData } from '@lib-shared/ui/drag-n-drop/types';
import { CheckboxProps } from './checkbox-props';
import { InputNumberProps } from './input-number-props';
import { SliderProps } from './slider-props';
import { InputTextProps } from './input-text-props';
import { SelectProps } from './select-props';

export type ContainerProps =
  | DndContainerProps<DndItemData>
  | SliderProps
  | CheckboxProps
  | InputNumberProps
  | InputTextProps
  | SelectProps;
