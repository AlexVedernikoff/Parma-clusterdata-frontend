import { DndItemData } from './dnd-item-data';

export type DndDraggedItem = {
  className: string;
  hoverIndex: number;
  index: number;
  data: DndItemData;
  listId: string;
  listAllowedTypes: Set<string> | undefined;
  listIsNeedRemove: boolean | undefined;
};
