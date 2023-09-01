import axios from 'axios';
import { NavigationList, NavigationListRequestParams } from '../types';

export const getNavigationListApi = async (
  params: NavigationListRequestParams,
): Promise<NavigationList> => {
  const URL = `${process.env.REACT_APP_CLUSTRUM_BI_HOST}/getNavigationList`;
  const response = await axios.post<NavigationList>(URL, params);
  return response.data;
};
