import { AllowedTypes, CheckAllowed } from './allowed-types';
import { DndItemData } from './dnd-item-data';
import { DndItemProps } from './dnd-item-props';
import { ItemSize } from './item-size';

export interface DndContainerProps {
  allowedTypes?: AllowedTypes;
  capacity?: number;
  disabled?: boolean;
  id: string;
  items: DndItemData[];
  itemSize: ItemSize;
  itemsClassName?: string;
  isNeedRemove?: boolean;
  isNeedSwap?: boolean;
  highlightDropPlace?: boolean;
  title?: string;
  listId?: string;
  onItemClick(e: Event, item: DndItemData): void;
  onUpdate(items: DndItemData[], insertItem?: DndItemData, action?: string): void;
  wrapTo(props: DndItemProps, component: HTMLDivElement | null): Element;
  checkAllowed?: CheckAllowed;
}
