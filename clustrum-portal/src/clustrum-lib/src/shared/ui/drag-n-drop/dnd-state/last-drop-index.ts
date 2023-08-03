// Это пока что единственный способ прокинуть в событие end актуальный drop index
let lastDropIndex: number | null = null;

export const getLastDropIndex = (): number | null => {
  return lastDropIndex;
};

export const setLastDropIndex = (index: number | null): void => {
  lastDropIndex = index;
};
