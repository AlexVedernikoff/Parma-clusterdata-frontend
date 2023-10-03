/* eslint-disable @typescript-eslint/naming-convention */
export enum AntdSortingOrder {
  ASC = 'ascend',
  DESC = 'descend',
}

export type AntdSortingOrderKey = keyof typeof AntdSortingOrder;

export enum SortingOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export interface SortingMapDataItem {
  title: string;
  direction: AntdSortingOrderKey;
}

export interface SortingMap {
  [key: string]: AntdSortingOrderKey;
}

export interface SortingMaps {
  sortingMapOfChanges: SortingMap;
  currentSortingMap: SortingMap;
}
