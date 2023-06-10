import { NavigationListRequestParams } from './types/navigation-list-request-params';
import { NavigationList } from './types/navigation-list';
import axios from 'axios';
import { baseURL } from '../../../configs/url-config';

export const getNavigationListRequest = async (
  params: NavigationListRequestParams,
): Promise<NavigationList> => {
  const response = await axios.post<NavigationList>('cd/bi/getNavigationList', params, {
    baseURL: baseURL,
  });
  return response.data;
};
