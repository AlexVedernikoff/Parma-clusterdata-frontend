import { DndItemData } from './dnd-item-data';

export interface DndDropResult {
  revert: boolean;
  targetItem: DndItemData;
  droppedItemId: string;
  isNeedReplace: boolean;
  dropPlace: number;
  isNeedSwap: boolean;
  dropContainerItems(items: DndItemData[]): void;
  dropContainerReplace(index: number, item: DndItemData): void;
  dropContainerInsert(index: number, item: DndItemData): void;
  dropContainerSwap(targetIndex: number, sourceIndex: number): void;
  setIsNeedReplace(isNeedReplace: boolean): void;
}
