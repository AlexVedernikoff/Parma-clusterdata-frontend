import { PaginateInfo } from '@lib-shared/types';
import { ExtendedColumnType } from './column-types';

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
