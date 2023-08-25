import { ColumnType } from 'antd/es/table';

export interface PaginateInfo {
  page: number;
  pageSize: number;
}

export interface TableWidgetProps {
  // TODO: типизировать таблицу (T - тип строки таблицы, record)
  // columns: ColumnType<T>[];
  totalRowsCount: string;
  columns: ColumnType<object>[];
  dataSource: object[];
  title: string | null;
  paginateInfo: PaginateInfo;
  onPageControlClicker(page: number, pageSize: number): void;
}
