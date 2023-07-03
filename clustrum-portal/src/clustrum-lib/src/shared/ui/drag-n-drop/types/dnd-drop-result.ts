import { DndItem } from './dnd-item';

export interface DndDropResult {
  revert: boolean;
  targetItem: DndItem;
  droppedItemId: string;
  isNeedReplace: boolean;
  dropPlace: number;
  isNeedSwap: boolean;
  dropContainerItems(items: DndItem[]): void;
  dropContainerReplace(index: number, item: DndItem): void;
  dropContainerInsert(item: DndItem, index: number): void;
  dropContainerSwap(targetIndex: number, sourceIndex: number): void;
  setIsNeedReplace(isNeedReplace: boolean): void;
}
