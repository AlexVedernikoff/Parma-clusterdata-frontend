import { DndItemData } from './dnd-item-data';

export type DndDraggedItem = {
  className: string;
  hoverIndex: number;
  index: number;
  data: DndItemData;
  containerId: string;
  containerAllowedTypes: Set<string> | undefined;
  containerIsNeedRemove: boolean | undefined;
};
