import { ColumnType } from 'antd/es/table';

export interface TableWidgetProps {
  // TODO: типизировать таблицу (T - тип строки таблицы, record)
  // columns: ColumnType<T>[];
  columns: ColumnType<object>[];
  dataSource: object[];
  title: string | null;
}
