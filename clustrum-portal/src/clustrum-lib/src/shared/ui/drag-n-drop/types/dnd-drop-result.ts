import { DndItem } from './dnd-item';

export interface DndDropResult {
  revert: boolean;
  targetItem: DndItem;
  droppedItemId: string;
  isNeedReplace: boolean;
  onReplaced(): void;
  dropContainerReplace(index: number, item: DndItem): void;
}
