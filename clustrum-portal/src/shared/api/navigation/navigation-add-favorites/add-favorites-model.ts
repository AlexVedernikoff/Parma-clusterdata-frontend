import {
  Store,
  createEffect,
  createEvent,
  createStore,
  Event,
  Effect,
  sample,
} from 'effector';

import { addFavoriteRequest } from './add-favorites-request';
import { AddFavoritesResponse } from './types/add-favorites-response';
import { AddFavoritesRequestParams } from './types/add-favorites-request-params';

export interface AddFavoritesModel {
  addFavoritesFx: Effect<AddFavoritesRequestParams, AddFavoritesResponse, Error>;
  $addFavoritesResponse: Store<AddFavoritesResponse | null>;
  addFavoritesEvent: Event<AddFavoritesRequestParams>;
}

export const addFavoritesModel = (): AddFavoritesModel => {
  const addFavoritesFx = createEffect(addFavoriteRequest);

  const $addFavoritesResponse = createStore<AddFavoritesResponse | null>(null)
    .on(addFavoritesFx.doneData, (state, result) => result)
    .on(addFavoritesFx.failData, () => null);

  const addFavoritesEvent = createEvent<AddFavoritesRequestParams>();

  sample({
    clock: addFavoritesEvent,
    target: addFavoritesFx,
  });

  return {
    $addFavoritesResponse,
    addFavoritesFx,
    addFavoritesEvent,
  };
};
