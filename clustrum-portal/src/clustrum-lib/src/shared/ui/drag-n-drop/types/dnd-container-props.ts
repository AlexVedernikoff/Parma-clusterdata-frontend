import { DndItemInterface } from './dnd-item';
import { DndItemProps } from './dnd-item-props';

export interface DndContainerProps {
  allowedTypes?: Set<string>;
  capacity?: number;
  disabled?: boolean;
  id: string;
  items: DndItemInterface[];
  itemsClassName?: string;
  noRemove?: boolean;
  title?: string;
  noSwap?: boolean;
  listId?: string; //Никто не отправляет
  noDropPlace?: boolean; //Никто не отправляет
  onItemClick(e: Event, item: DndItemInterface): void;
  onUpdate(items: DndItemInterface[], insertItem?: DndItemInterface, action?: string, onUndoAction?: () => void): void;
  wrapTo(props: DndItemProps, component: JSX.Element): Element;
  checkAllowed?(item: DndItemInterface): boolean;
}
