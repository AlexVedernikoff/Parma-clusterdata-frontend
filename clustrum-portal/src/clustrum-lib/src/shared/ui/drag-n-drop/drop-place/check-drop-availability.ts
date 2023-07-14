import { AllowedTypes, CheckAllowed, DndItemData } from '../types';

export const checkDropAvailability = (
  draggedItemData?: DndItemData,
  allowedTypes?: AllowedTypes,
  checkAllowed?: CheckAllowed,
): boolean => {
  if (!draggedItemData) {
    return false;
  }

  if (allowedTypes) {
    return allowedTypes.has(draggedItemData.type);
  }

  if (checkAllowed) {
    return checkAllowed(draggedItemData);
  }

  return true;
};
