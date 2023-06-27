import { DndItem } from './dnd-item';

export interface DndDropResult {
  revert: boolean;
  targetItem: DndItem;
  droppedItemId: string;
  isNeedReplace: boolean;
  onSetReplaced(val: boolean): void;
  dragContainerReplace(index: number, item: DndItem): void;
}
