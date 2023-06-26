import { DndItem } from './dnd-item';

export interface DndDropResult {
  revert: boolean;
  targetItem: DndItem;
  dropedItem: DndItem;
  isNeedReplace: boolean;
  onSetReplaced(val: boolean): void;
  replace(index: number, item: DndItem): void;
}
