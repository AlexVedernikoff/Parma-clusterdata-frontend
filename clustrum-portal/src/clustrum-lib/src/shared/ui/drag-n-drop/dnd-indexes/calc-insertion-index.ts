import { getLastDropIndex } from './last-drop-index';

export const calcInsertionIndex = (
  sourceIndex: number,
  hoverIndex: number,
  inSameContainer = false,
): number => {
  const lastDropIndex = getLastDropIndex();

  if (lastDropIndex && inSameContainer) {
    return lastDropIndex > sourceIndex ? lastDropIndex - 1 : lastDropIndex;
  }

  if (lastDropIndex) {
    return lastDropIndex;
  }

  return hoverIndex;
};
