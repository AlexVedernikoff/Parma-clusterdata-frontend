import axios from 'axios';
import { NavigationListRequestParams, NavigationList } from './dto';

export const getNavigationListRequest = async (
  params: NavigationListRequestParams,
): Promise<NavigationList> => {
  const URL = `${process.env.REACT_APP_CLUSTRUM_BI_HOST}/getNavigationList`;
  const response = await axios.post<NavigationList>(URL, params);
  return response.data;
};
