import { Order, Places } from '@shared/lib/constants';

export interface NavigationListRequestParams {
  orderBy?: Order;
  page: number | null;
  pageSize: number;
  path: string;
  place: Places | null;
  placeParameters?: PlaceParameters; // TODO: поле, возможно, не нужно, удалить после уточнения api
}

interface PlaceParameters {
  displayParentFolder: boolean;
  filters: boolean;
  icon: Icon;
  iconClassName: string;
  pagination: boolean;
  place: string;
  sort: boolean;
  text: string;
}

interface Icon {
  id: string;
  url: string;
  viewBox: string;
}
