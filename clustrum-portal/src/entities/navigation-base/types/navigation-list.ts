import { NavigationEntryData } from '@clustrum-lib/shared/types';

export interface NavigationList {
  entries: NavigationEntryData[];
  hasNextPage: boolean;
}
