import { DndDraggedItem } from './dnd-dragged-item';
import { DndItemData } from './dnd-item-data';
import { ItemSize } from './item-size';

export interface DndItemProps {
  className: string;
  size: ItemSize;
  disabled?: boolean;
  containerAllowedTypes?: Set<string>;
  containerIsNeedRemove?: boolean;
  containerId: string;
  index: number;
  itemData: DndItemData;
  tooltipVisibility: boolean;
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
