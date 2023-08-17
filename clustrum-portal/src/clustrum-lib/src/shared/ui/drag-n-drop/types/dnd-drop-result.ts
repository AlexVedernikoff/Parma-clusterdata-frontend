export interface DndDropResult<T> {
  revert: boolean;
  itemData: T;
  containerId: string;
  isNeedReplace: boolean;
  dropPlace: number | null;
  isNeedSwap: boolean;
  items: T[];
  replace(index: number, item: T): void;
  insert(index: number, item: T): void;
  swap(targetIndex: number, sourceIndex: number): void;
  setIsNeedReplace(isNeedReplace: boolean): void;
}

export type DndEmptyDropResult<T> = Pick<DndDropResult<T>, 'revert'>;

export const notEmptyDndDropResult = <T>(
  dropResult: DndDropResult<T> | DndEmptyDropResult<T>,
): dropResult is DndDropResult<T> =>
  (dropResult as DndDropResult<T>).containerId !== undefined;
