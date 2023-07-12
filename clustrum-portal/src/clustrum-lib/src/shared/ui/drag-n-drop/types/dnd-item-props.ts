import { DndDraggedItem } from './dnd-dragged-item';
import { DndItemData } from './dnd-item-data';

export interface DndItemProps {
  className: string;
  disabled?: boolean;
  listAllowedTypes?: Set<string>;
  listIsNeedRemove?: boolean;
  listId: string;
  index: number;
  item: DndItemData;
  tooltipVisible: boolean;
  draggedItem: DndDraggedItem | null;
  onItemClick(e: Event, item: DndItemData): void;
  remove(index: number): void;
  wrapTo(props: DndItemProps, component: HTMLDivElement | null): Element;
  setTooltipVisible(isVisible: boolean): void;
  setDropPlace(index: number | null): void;
  dragContainerReplace(index: number, item: DndItemData): void;
  setDraggedItem(item: DndDraggedItem): void;
  setIsNeedReplace(isNeedReplace: boolean): void;
}
