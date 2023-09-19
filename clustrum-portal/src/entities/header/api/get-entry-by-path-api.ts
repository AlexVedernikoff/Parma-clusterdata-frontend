import axios from 'axios';
import { NavigationEntryData } from '@clustrum-lib/shared/types';
import { EntryByPathRequestParams } from '../types';

export const getEntryDataByPathApi = async ({
  key,
}: EntryByPathRequestParams): Promise<NavigationEntryData> => {
  const URL = `${process.env.REACT_APP_CLUSTRUM_BI_HOST}/getEntryByKey`;
  const response = await axios.post<NavigationEntryData>(URL, { key });
  return response.data;
};
