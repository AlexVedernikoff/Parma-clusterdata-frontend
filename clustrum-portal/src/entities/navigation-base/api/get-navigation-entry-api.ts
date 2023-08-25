import { NavigationEntryData } from '@clustrum-lib/shared/types';
import {
  NavigationEntryRequestParams,
  getNavigationEntryRequest,
} from '@shared/api/navigation-entry';

export const getNavigationEntryApi = async (
  params: NavigationEntryRequestParams,
): Promise<NavigationEntryData> => getNavigationEntryRequest(params);
