import { DndContainerProps, DndItemData } from '@lib-shared/ui/drag-n-drop/types';
import { ContainerProps } from './container-props';

export function isDndContainerProps(
  props: ContainerProps,
): props is DndContainerProps<DndItemData> {
  return (props as DndContainerProps<DndItemData>).wrapTo !== undefined;
}
