/* eslint-disable @typescript-eslint/naming-convention */
export enum ESortDir {
  ASC = 'ascend',
  DESC = 'descend',
}

export interface ISortMapItem {
  [key: string]: keyof typeof ESortDir;
}

export type ISortMap = {
  [key in 'sortMap' | 'differenceValue']: ISortMapItem;
};
