import { DndContainerProps, DndItemData } from '@lib-shared/ui/drag-n-drop/types';
import { CheckboxProps } from './checkbox-props';
import { ContainerProps } from './container-props';
import { SelectProps } from './select-props';
import { InputNumberProps } from './input-number-props';
import { InputTextProps } from './input-text-props';
import { SliderProps } from './slider-props';

export function isDndContainerProps(
  props: ContainerProps,
): props is DndContainerProps<DndItemData> {
  return (props as DndContainerProps<DndItemData>).wrapTo !== undefined;
}

export function isCheckboxProps(props: ContainerProps): props is CheckboxProps {
  return (props as CheckboxProps).checked !== undefined;
}

export function isSelectProps(props: ContainerProps): props is SelectProps {
  return (props as SelectProps).options !== undefined;
}

export function isInputNumberProps(props: ContainerProps): props is InputNumberProps {
  return (props as InputNumberProps).controls !== undefined;
}

export function isInputTextProps(props: ContainerProps): props is InputTextProps {
  return (props as InputTextProps).type !== undefined;
}

export function isSliderProps(props: ContainerProps): props is SliderProps {
  return (props as SliderProps).min !== undefined;
}
