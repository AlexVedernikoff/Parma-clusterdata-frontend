// Это пока что единственный способ прокинуть в событие end актуальную target item data
let targetItemData: unknown | null = null;

export const getTargetItemData = <T>(): T | null => {
  return targetItemData as T;
};

export const setTargetItemData = <T>(data: T | null): void => {
  targetItemData = data;
};
