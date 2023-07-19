import { AllowedTypes, CheckAllowed } from './allowed-types';
import { DndItemData } from './dnd-item-data';
import { DndItemProps } from './dnd-item-props';
import { DndItemSize } from './dnd-item-size';

export interface DndContainerProps {
  id: string;
  title?: string;
  allowedTypes?: AllowedTypes;
  capacity?: number;
  disabled?: boolean;
  items: DndItemData[];
  itemSize: DndItemSize;
  itemsClassName?: string;
  isNeedRemove?: boolean;
  isNeedSwap?: boolean;
  highlightDropPlace?: boolean;
  wrapTo(props: DndItemProps, component: HTMLDivElement | null): JSX.Element;
  checkAllowed?: CheckAllowed;
  onItemClick?(e: Event, item: DndItemData): void;
  onUpdate?(items: DndItemData[], insertItem?: DndItemData, action?: string): void;
}
