import axios from 'axios';
import { ToggleFavoriteRequestParams, ToggleFavoriteResponse } from '../types';

export const removeFavoritesApi = async (
  params: ToggleFavoriteRequestParams,
): Promise<ToggleFavoriteResponse> => {
  const URL = `${process.env.REACT_APP_CLUSTRUM_BI_HOST}/deleteFavorite`;
  const response = await axios.post<ToggleFavoriteResponse>(URL, params);
  return response.data;
};
