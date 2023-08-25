import axios from 'axios';
import { ToggleFavoriteRequestParams, ToggleFavoriteResponse } from './dto';

export const removeFavoriteRequest = async (
  params: ToggleFavoriteRequestParams,
): Promise<ToggleFavoriteResponse> => {
  const URL = `${process.env.REACT_APP_CLUSTRUM_BI_HOST}/deleteFavorite`;
  const response = await axios.post<ToggleFavoriteResponse>(URL, params);
  return response.data;
};
