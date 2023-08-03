import { DndItemData } from './dnd-item-data';

export interface DndDropResult {
  revert: boolean;
  itemData: DndItemData;
  containerId: string;
  isNeedReplace: boolean;
  dropPlace: number | null;
  isNeedSwap: boolean;
  items: DndItemData[];
  replace(index: number, item: DndItemData): void;
  insert(index: number, item: DndItemData): void;
  swap(targetIndex: number, sourceIndex: number): void;
  setIsNeedReplace(isNeedReplace: boolean): void;
}

export type DndEmptyDropResult = Pick<DndDropResult, 'revert'>;

export const notEmptyDndDropResult = (
  dropResult: DndDropResult | DndEmptyDropResult,
): dropResult is DndDropResult => (dropResult as DndDropResult).containerId !== undefined;
