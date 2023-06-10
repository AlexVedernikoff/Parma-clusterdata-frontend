import {
  Store,
  createEffect,
  createEvent,
  createStore,
  Event,
  Effect,
  sample,
} from 'effector';
import { RemoveFavoritesRequestParams } from './types/remove-favorites-request-params';
import { RemoveFavoritesResponse } from './types/remove-favorites-response';
import { removeFavoriteRequest } from './remove-favorites-request';

export interface RemoveFavoritesModel {
  removeFavoritesFx: Effect<RemoveFavoritesRequestParams, RemoveFavoritesResponse, Error>;
  $removeFavoritesResponse: Store<RemoveFavoritesResponse | null>;
  removeFavoritesEvent: Event<RemoveFavoritesRequestParams>;
}

export const removeFavoritesModel = (): RemoveFavoritesModel => {
  const removeFavoritesFx = createEffect(removeFavoriteRequest);

  const $removeFavoritesResponse = createStore<RemoveFavoritesResponse | null>(null)
    .on(removeFavoritesFx.doneData, (state, result) => result)
    .on(removeFavoritesFx.failData, () => null);

  const removeFavoritesEvent = createEvent<RemoveFavoritesRequestParams>();

  sample({
    clock: removeFavoritesEvent,
    target: removeFavoritesFx,
  });

  return {
    $removeFavoritesResponse,
    removeFavoritesFx,
    removeFavoritesEvent,
  };
};
