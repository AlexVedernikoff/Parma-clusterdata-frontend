/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO определить типы
export interface SectionDatasetItemProps {
  item: any;
  className: string;
  // TODO
  isDragging?: boolean;
  updateDatasetByValidation(params: { fields: any; updates: any; sdk: any }): void;
  setState(isOpening: boolean, field: any): void;
  sdk: any;
  dataset: any;
  updates: any[];
}
