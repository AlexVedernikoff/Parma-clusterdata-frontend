import { DndItem } from './dnd-item';

export interface DndDropResult {
  revert: boolean;
  targetItem: DndItem;
  droppedItemId: string;
  isNeedReplace: boolean;
  onReplaced(): void;
  replace(index: number, item: DndItem): void;
}
