import { NavigationItem } from '../../../../types/navigation-item';

export interface NavigationList {
  entries: NavigationItem[];
  hasNextPage: boolean;
}
