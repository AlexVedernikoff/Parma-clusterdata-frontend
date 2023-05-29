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
  remove(index: number): void;
  wrapTo(props: DndItemProps, component: JSX.Element): Element;
  setTooltipVisible(isVisible: boolean): void;
}
