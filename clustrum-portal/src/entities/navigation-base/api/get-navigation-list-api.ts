import {
  getNavigationListRequest,
  NavigationList,
  NavigationListRequestParams,
} from '@shared/api/navigation-list';

export const getNavigationListApi = async (
  params: NavigationListRequestParams,
): Promise<NavigationList> => getNavigationListRequest(params);
