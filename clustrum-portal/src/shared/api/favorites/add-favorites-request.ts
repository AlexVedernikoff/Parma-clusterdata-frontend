import axios from 'axios';
import { ToggleFavoriteRequestParams, ToggleFavoriteResponse } from './dto';

export const addFavoriteRequest = async (
  params: ToggleFavoriteRequestParams,
): Promise<ToggleFavoriteResponse> => {
  const URL = `${process.env.REACT_APP_CLUSTRUM_BI_HOST}/addFavorite`;
  const response = await axios.post<ToggleFavoriteResponse>(URL, params);
  return response.data;
};
