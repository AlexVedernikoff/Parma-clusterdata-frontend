import { AllowedTypes, CheckAllowed } from './allowed-types';
import { DndItemData } from './dnd-item-data';

export type DndDraggedItem = {
  className: string;
  hoverIndex: number;
  index: number;
  data: DndItemData;
  containerId: string;
  containerAllowedTypes?: AllowedTypes;
  containerIsNeedRemove?: boolean;
  containerCheckAllowed?: CheckAllowed;
};
