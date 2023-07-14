import { DndItemData } from '../types';

// Это пока что единственный способ прокинуть в событие end актуальную target item data
let targetItemData: DndItemData | null = null;

export const getTargetItemData = (): DndItemData | null => {
  return targetItemData;
};

export const setTargetItemData = (data: DndItemData | null): void => {
  targetItemData = data;
};
