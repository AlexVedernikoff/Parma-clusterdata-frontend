import { DndContainerProps, DndItemData } from '@lib-shared/ui/drag-n-drop/types';

export function isDndContainerProps(
  props: DndContainerProps<DndItemData> | object,
): props is DndContainerProps<DndItemData> {
  return (props as DndContainerProps<DndItemData>).wrapTo !== undefined;
}
