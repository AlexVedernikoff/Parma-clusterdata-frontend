import { AllowedTypes, CheckAllowed } from './allowed-types';
import { DndDraggedItem } from './dnd-dragged-item';
import { DndItemData } from './dnd-item-data';

export interface CheckDndActionAvailabilityCustomParams {
  itemData?: DndItemData;
  allowedTypes?: AllowedTypes;
  checkAllowed?: CheckAllowed;
}

export interface CheckActionAvailabilityForDraggedItemParams {
  draggedItem: DndDraggedItem;
}

export type CheckDndActionAvailabilityParams =
  | CheckDndActionAvailabilityCustomParams
  | CheckActionAvailabilityForDraggedItemParams;

export const isCheckDndActionAvailabilityForDraggedItemParams = (
  params: CheckDndActionAvailabilityParams,
): params is CheckActionAvailabilityForDraggedItemParams =>
  (params as CheckActionAvailabilityForDraggedItemParams).draggedItem !== undefined;
