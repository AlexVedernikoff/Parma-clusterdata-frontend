import {
  CheckDndActionAvailabilityCustomParams,
  CheckDndActionAvailabilityParams,
  isCheckDndActionAvailabilityForDraggedItemParams,
} from '../types';

const parseParams = (
  params: CheckDndActionAvailabilityParams,
): CheckDndActionAvailabilityCustomParams => {
  if (!isCheckDndActionAvailabilityForDraggedItemParams(params)) {
    return params;
  }

  const {
    draggedItem: { data, containerAllowedTypes, containerCheckAllowed },
  } = params;

  return {
    itemData: data,
    allowedTypes: containerAllowedTypes,
    checkAllowed: containerCheckAllowed,
  };
};

export const checkDndActionAvailability = (
  params: CheckDndActionAvailabilityParams,
): boolean => {
  const { itemData, allowedTypes, checkAllowed } = parseParams(params);

  if (!itemData) {
    return false;
  }

  if (allowedTypes) {
    return allowedTypes.has(itemData.type);
  }

  if (checkAllowed) {
    return checkAllowed(itemData);
  }

  return true;
};
