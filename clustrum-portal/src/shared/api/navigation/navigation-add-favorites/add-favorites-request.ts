import axios from 'axios';
import { baseURL } from '../../../configs/url-config';
import { AddFavoritesResponse } from './types/add-favorites-response';
import { AddFavoritesRequestParams } from './types/add-favorites-request-params';

export const addFavoriteRequest = async (
  params: AddFavoritesRequestParams,
): Promise<AddFavoritesResponse> => {
  const response = await axios.post<AddFavoritesResponse>('cd/bi/addFavorite', params, {
    baseURL: baseURL,
  });
  return response.data;
};
