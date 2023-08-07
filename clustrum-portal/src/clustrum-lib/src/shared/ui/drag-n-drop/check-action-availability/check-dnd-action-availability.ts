import {
  CheckDndActionAvailabilityCustomParams,
  CheckDndActionAvailabilityParams,
  DndItemGenericData,
  isCheckDndActionAvailabilityForDraggedItemParams,
} from '../types';

const parseParams = <T>(
  params: CheckDndActionAvailabilityParams<T>,
): CheckDndActionAvailabilityCustomParams<T> => {
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

export const checkDndActionAvailability = <T extends DndItemGenericData>(
  params: CheckDndActionAvailabilityParams<T>,
): boolean => {
  const { itemData, allowedTypes, checkAllowed } = parseParams(params);

  if (!itemData) {
    return false;
  }

  const itemDataType = itemData.type;
  if (allowedTypes && itemDataType) {
    return allowedTypes.has(itemDataType);
  }

  if (checkAllowed) {
    return checkAllowed(itemData);
  }

  return true;
};
