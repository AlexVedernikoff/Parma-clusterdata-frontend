import { ItemSize } from './item-size';

export interface DropPlaceProps {
  isDraggedItemHasData: boolean;
  canDrop: boolean;
  isOver: boolean;
  itemSize: ItemSize;
  itemsCount: number;
  capacity?: number;
  dropPlace: number | null;
}
