import { AllowedTypes, CheckAllowed } from './allowed-types';
import { DndDraggedItem } from './dnd-dragged-item';
import { DndItemSize } from './dnd-item-size';

export interface DndItemProps<T> {
  className: string;
  size: DndItemSize;
  disabled?: boolean;
  containerAllowedTypes?: AllowedTypes;
  containerIsNeedRemove?: boolean;
  containerId: string;
  index: number;
  itemData: T;
  draggedItem: DndDraggedItem<T> | null;
  remove(index: number): void;
  replace(index: number, item: T): void;
  wrapTo(props: DndItemProps<T>, component: HTMLDivElement | null): JSX.Element;
  setDropPlace(index: number | null): void;
  setDraggedItem(item: DndDraggedItem<T>): void;
  setIsNeedReplace(isNeedReplace: boolean): void;
  containerCheckAllowed?: CheckAllowed<T>;
  onItemClick?(e: Event, item: T): void;
}
