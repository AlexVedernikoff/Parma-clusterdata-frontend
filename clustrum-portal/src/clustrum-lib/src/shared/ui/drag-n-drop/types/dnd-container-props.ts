import { AllowedTypes, CheckAllowed } from './allowed-types';
import { DndItemProps } from './dnd-item-props';
import { DndItemSize } from './dnd-item-size';

export interface DndContainerProps<T> {
  id: string;
  title?: string;
  allowedTypes?: AllowedTypes;
  capacity?: number;
  disabled?: boolean;
  items: T[];
  itemSize: DndItemSize;
  itemsClassName?: string;
  isNeedRemove?: boolean;
  isNeedSwap?: boolean;
  highlightDropPlace?: boolean;
  wrapTo(props: DndItemProps<T>, component: HTMLDivElement | null): JSX.Element;
  checkAllowed?: CheckAllowed<T>;
  onItemClick?(e: Event, item: T): void;
  onUpdate?(items: T[], insertItem?: T, action?: string): void;
}
