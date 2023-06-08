import { NULL_ALIAS } from '../lib';

type PrimitiveCellValue = number | string | Date;
type CellValue = PrimitiveCellValue | PrimitiveCellValue[] | null;

export interface Cell {
  type: string;
  value: CellValue;
  link: {
    href: string;
    newWindow: boolean;
  };
  grid: Cell[];
  valueWithAlias: CellValue | typeof NULL_ALIAS;
  hasArray: boolean;
  resultShemaId: string;
}

// Внимание! Должно совпадать со значениями объекта `DATE_TYPE`
// в `date-format.js`
// **************************
// const DATE_TYPE = {
//   date: 'date',
//   datetime: 'datetime',
// };
// **************************
// TODO: При типизации `date-format.js` → `date-format.ts`
// использовать один общий тип там и здесь
export type DateType = 'date' | 'datetime';
