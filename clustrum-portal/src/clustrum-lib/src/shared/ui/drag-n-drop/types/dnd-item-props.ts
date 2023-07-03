import { DndDropedItem } from './dnd-droped-item';
import { DndItem } from './dnd-item';

export interface DndItemProps {
  className: string;
  disabled?: boolean;
  listAllowedTypes?: Set<string>;
  listNoRemove?: boolean;
  listId: string;
  index: number;
  item: DndItem;
  tooltipVisible: boolean;
  draggingItem: DndDropedItem | null;
  onItemClick(e: Event, item: DndItem): void;
  remove(index: number): void;
  wrapTo(props: DndItemProps, component: HTMLDivElement | null): Element;
  setTooltipVisible(isVisible: boolean): void;
  setDropPlace(index: number | null): void;
  dragContainerReplace(index: number, item: DndItem): void;
  setDraggingItem(item: DndDropedItem): void;
  setIsNeedReplace(isNeed: boolean): void;
}
