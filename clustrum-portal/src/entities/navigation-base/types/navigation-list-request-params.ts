import { SortingOrder } from '@clustrum-lib/shared/types';
import { Places } from '@shared/config/routing';

export interface NavigationListRequestParams {
  orderBy?: SortingOrder;
  page: number | null;
  pageSize: number;
  token: string;
  path: string;
  place: Places | null;
  placeParameters?: PlaceParameters; // TODO: поле, возможно, не нужно, удалить после уточнения api
}

export interface PlaceParameters {
  displayParentFolder: boolean;
  filters: boolean;
  icon: Icon;
  iconClassName: string;
  pagination: boolean;
  place: string;
  sort: boolean;
  text: string;
}

export interface Icon {
  id: string;
  url: string;
  viewBox: string;
}
