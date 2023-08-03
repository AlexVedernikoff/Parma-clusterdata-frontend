import { AllowedTypes, CheckAllowed } from './allowed-types';
import { DndDraggedItem } from './dnd-dragged-item';
import { DndItemData } from './dnd-item-data';
import { DndItemSize } from './dnd-item-size';

export interface DndItemProps {
  className: string;
  size: DndItemSize;
  disabled?: boolean;
  containerAllowedTypes?: AllowedTypes;
  containerIsNeedRemove?: boolean;
  containerId: string;
  index: number;
  itemData: DndItemData;
  tooltipVisibility: boolean;
  draggedItem: DndDraggedItem | null;
  remove(index: number): void;
  replace(index: number, item: DndItemData): void;
  wrapTo(props: DndItemProps, component: HTMLDivElement | null): JSX.Element;
  setTooltipVisibility(isVisible: boolean): void;
  setDropPlace(index: number | null): void;
  setDraggedItem(item: DndDraggedItem): void;
  setIsNeedReplace(isNeedReplace: boolean): void;
  containerCheckAllowed?: CheckAllowed;
  onItemClick?(e: Event, item: DndItemData): void;
}
