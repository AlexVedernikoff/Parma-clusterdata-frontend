import { AllowedTypes, CheckAllowed } from './allowed-types';
import { DndDraggedItem } from './dnd-dragged-item';

export interface CheckDndActionAvailabilityCustomParams<T> {
  itemData?: T;
  allowedTypes?: AllowedTypes;
  checkAllowed?: CheckAllowed<T>;
}

export interface CheckActionAvailabilityForDraggedItemParams<T> {
  draggedItem: DndDraggedItem<T>;
}

export type CheckDndActionAvailabilityParams<T> =
  | CheckDndActionAvailabilityCustomParams<T>
  | CheckActionAvailabilityForDraggedItemParams<T>;

export const isCheckDndActionAvailabilityForDraggedItemParams = <T>(
  params: CheckDndActionAvailabilityParams<T>,
): params is CheckActionAvailabilityForDraggedItemParams<T> =>
  (params as CheckActionAvailabilityForDraggedItemParams<T>).draggedItem !== undefined;
