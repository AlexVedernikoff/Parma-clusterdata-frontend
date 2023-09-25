import { DndContainerProps } from '@lib-shared/ui/drag-n-drop/types';
import { DndItemData } from '@lib-entities/visualization-factory/types';
import { ContainerProps } from './container-props';

export function isDndContainerProps(
  props: ContainerProps,
): props is DndContainerProps<DndItemData> {
  return (props as DndContainerProps<DndItemData>).wrapTo !== undefined;
}
