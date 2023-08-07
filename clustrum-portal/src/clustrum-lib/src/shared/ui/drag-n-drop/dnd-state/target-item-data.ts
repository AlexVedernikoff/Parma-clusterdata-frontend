// Это пока что единственный способ прокинуть в событие end актуальную target item data
// используется тип any из-за generic type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let targetItemData: any | null = null;

export const getTargetItemData = <T>(): T | null => {
  return targetItemData;
};

export const setTargetItemData = <T>(data: T | null): void => {
  targetItemData = data;
};
