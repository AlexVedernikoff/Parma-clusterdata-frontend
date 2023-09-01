import { Places } from '@shared/config/routing';
import { Order } from '@shared/types';

export interface NavigationListRequestParams {
  orderBy?: Order;
  page: number | null;
  pageSize: number;
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
