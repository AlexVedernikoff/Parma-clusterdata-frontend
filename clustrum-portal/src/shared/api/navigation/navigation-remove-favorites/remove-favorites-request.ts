import axios from 'axios';
import { baseURL } from '../../../configs/url-config';
import { RemoveFavoritesRequestParams } from './types/remove-favorites-request-params';
import { RemoveFavoritesResponse } from './types/remove-favorites-response';

export const removeFavoriteRequest = async (
  params: RemoveFavoritesRequestParams,
): Promise<RemoveFavoritesResponse> => {
  const response = await axios.post<RemoveFavoritesResponse>(
    'cd/bi/deleteFavorite',
    params,
    {
      baseURL: baseURL,
    },
  );
  return response.data;
};
