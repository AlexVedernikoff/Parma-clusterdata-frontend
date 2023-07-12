import { DndItemData } from './dnd-item-data';

export type DndDraggedItem = {
  className: string;
  hoverIndex: number;
  index: number;
  item: DndItemData;
  listAllowedTypes: Set<string> | undefined;
  listId: string;
  listIsNeedRemove: boolean | undefined;
  replace(index: number, item: DndItemData): void;
};
