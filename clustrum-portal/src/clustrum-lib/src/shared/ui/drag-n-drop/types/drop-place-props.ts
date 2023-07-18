import { DndItemSize } from './dnd-item-size';

export interface DropPlaceProps {
  isDraggedItemHasData: boolean;
  canDrop: boolean;
  isOver: boolean;
  itemSize: DndItemSize;
  itemsCount: number;
  dropPlace: number | null;
  capacity?: number;
}
