import axios from 'axios';
import { NavigationEntryData } from '@clustrum-lib/shared/types';
import { NavigationEntryRequestParams } from '../types';

export const getNavigationEntryApi = async ({
  entryId,
}: NavigationEntryRequestParams): Promise<NavigationEntryData> => {
  const URL = `${process.env.REACT_APP_CLUSTRUM_BI_HOST}/getEntry`;
  const response = await axios.post<NavigationEntryData>(URL, { entryId });
  return response.data;
};
