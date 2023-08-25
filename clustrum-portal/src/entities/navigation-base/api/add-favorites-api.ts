import {
  addFavoriteRequest,
  ToggleFavoriteRequestParams,
  ToggleFavoriteResponse,
} from '@shared/api/favorites';

export const addFavoritesApi = async (
  params: ToggleFavoriteRequestParams,
): Promise<ToggleFavoriteResponse> => addFavoriteRequest(params);
