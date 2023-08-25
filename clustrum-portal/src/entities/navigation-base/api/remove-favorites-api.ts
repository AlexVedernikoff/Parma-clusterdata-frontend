import {
  removeFavoriteRequest,
  ToggleFavoriteRequestParams,
  ToggleFavoriteResponse,
} from '@shared/api/favorites';

export const removeFavoritesApi = async (
  params: ToggleFavoriteRequestParams,
): Promise<ToggleFavoriteResponse> => removeFavoriteRequest(params);
