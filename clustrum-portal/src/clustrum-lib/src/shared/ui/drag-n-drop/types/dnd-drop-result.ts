import { DndItemData } from './dnd-item-data';

export interface DndDropResult {
  revert: boolean;
  targetItem: DndItemData;
  droppedItemId: string;
  isNeedReplace: boolean;
  dropPlace: number | null;
  isNeedSwap: boolean;
  dropContainerItems: DndItemData[];
  dropContainerReplace(index: number, item: DndItemData): void;
  dropContainerInsert(index: number, item: DndItemData): void;
  dropContainerSwap(targetIndex: number, sourceIndex: number): void;
  setIsNeedReplace(isNeedReplace: boolean): void;
}

export type DndEmptyDropResult = Pick<DndDropResult, 'revert'>;

export const notEmptyDndDropResult = (
  dropResult: DndDropResult | DndEmptyDropResult,
): dropResult is DndDropResult =>
  (dropResult as DndDropResult).droppedItemId !== undefined;
