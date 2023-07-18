import { AllowedTypes, CheckAllowed } from './allowed-types';
import { DndItemData } from './dnd-item-data';
import { DndItemProps } from './dnd-item-props';
import { ItemSize } from './item-size';

export interface DndContainerProps {
  id: string;
  title?: string;
  allowedTypes?: AllowedTypes;
  capacity?: number;
  disabled?: boolean;
  items: DndItemData[];
  itemSize: ItemSize;
  itemsClassName?: string;
  isNeedRemove?: boolean;
  isNeedSwap?: boolean;
  highlightDropPlace?: boolean;
  checkAllowed?: CheckAllowed;
  wrapTo(props: DndItemProps, component: HTMLDivElement | null): Element;
  onItemClick(e: Event, item: DndItemData): void;
  onUpdate(items: DndItemData[], insertItem?: DndItemData, action?: string): void;
}
