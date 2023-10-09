import { ColumnType } from 'antd/es/table';

export type ExtendedColumnType<RecordType> = ColumnType<RecordType> & { id: string };

export const isExtendedColumnType = <T>(
  column: ColumnType<T>,
): column is ExtendedColumnType<T> => {
  return (column as ExtendedColumnType<T>).id !== undefined;
};
