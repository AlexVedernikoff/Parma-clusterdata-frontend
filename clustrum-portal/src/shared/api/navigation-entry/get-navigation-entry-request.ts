import axios from 'axios';
import { NavigationEntryRequestParams } from './dto';
import { NavigationEntryData } from '@clustrum-lib/shared/types';

export const getNavigationEntryRequest = async ({
  entryId,
}: NavigationEntryRequestParams): Promise<NavigationEntryData> => {
  const URL = `${process.env.REACT_APP_CLUSTRUM_BI_HOST}/getEntry`;
  const response = await axios.post<NavigationEntryData>(URL, { entryId });
  return response.data;
};
