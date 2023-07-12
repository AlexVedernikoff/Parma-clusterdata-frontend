import { DndItemData } from './dnd-item-data';
import { DndItemProps } from './dnd-item-props';

export interface DndContainerProps {
  allowedTypes?: Set<string>;
  capacity?: number;
  disabled?: boolean;
  id: string;
  items: DndItemData[];
  itemsClassName?: string;
  isNeedRemove?: boolean;
  isNeedSwap?: boolean;
  title?: string;
  listId?: string;
  onItemClick(e: Event, item: DndItemData): void;
  onUpdate(items: DndItemData[], insertItem?: DndItemData, action?: string): void;
  wrapTo(props: DndItemProps, component: HTMLDivElement | null): Element;
  checkAllowed?(item: DndItemData): boolean;
}
