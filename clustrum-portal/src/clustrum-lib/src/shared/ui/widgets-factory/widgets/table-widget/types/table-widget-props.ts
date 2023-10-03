import { ExtendedColumnType } from './column-types';
import { PaginateInfo } from './pagination-types';

export interface TableWidgetProps {
  totalRowsCount: string;
  columns: ExtendedColumnType<object>[];
  dataSource: object[];
  title: string | null;
  paginateInfo: PaginateInfo;
  onPageControlClicker(page: number, pageSize: number): void;
  onStateAndParamsChange?(paginateInfo: PaginateInfo): void;
  onOrderByClickInWizard?(direction: string, field: string): void;
}
