import { DndItem } from './dnd-item';
import { DndItemProps } from './dnd-item-props';

export interface DndContainerProps {
  allowedTypes?: Set<string>;
  capacity?: number;
  disabled?: boolean;
  id: string;
  items: DndItem[];
  itemsClassName?: string;
  noRemove?: boolean;
  title?: string;
  listId?: string;
  onItemClick(e: Event, item: DndItem): void;
  onUpdate(items: DndItem[], insertItem?: DndItem, action?: string): void;
  wrapTo(props: DndItemProps, component: HTMLDivElement | null): Element;
  checkAllowed?(item: DndItem): boolean;
}
