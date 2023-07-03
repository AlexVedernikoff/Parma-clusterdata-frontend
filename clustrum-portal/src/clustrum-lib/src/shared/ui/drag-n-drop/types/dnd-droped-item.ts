import { DndItem } from './dnd-item';

export type DndDropedItem = {
  className: string;
  hoverIndex: number;
  index: number;
  item: DndItem;
  listAllowedTypes: Set<string> | undefined;
  listId: string;
  listIsNeedRemove: boolean | undefined;
  replace(index: number, item: DndItem): void;
};
