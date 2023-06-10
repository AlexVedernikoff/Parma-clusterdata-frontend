import axios from 'axios';
import { baseURL } from '../../../configs/url-config';
import { NavigationItem } from '../../../types/navigation-item';
import { NavigationEntryRequestParams } from './types/navigation-entry-request-params';

export const getNavigationEntryRequest = async ({
  entryId,
}: NavigationEntryRequestParams): Promise<NavigationItem> => {
  const response = await axios.post<NavigationItem>(
    'cd/bi/getEntry',
    { entryId },
    {
      baseURL: baseURL,
    },
  );
  return response.data;
};
