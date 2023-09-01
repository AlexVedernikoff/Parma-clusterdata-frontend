import { createEffect, createEvent, createStore, sample } from 'effector';
import { addFavoritesApi } from '../api/add-favorites-api';
import { removeFavoritesApi } from '../api/remove-favorites-api';
import { getNavigationEntryApi } from '../api/get-navigation-entry-api';
import { getNavigationListApi } from '../api/get-navigation-list-api';
import { NAVIGATION_ERROR } from '../lib/constants';
import {
  NavigationList,
  NavigationListRequestParams,
  NavigationParams,
  ToggleFavoriteRequestParams,
} from '../types';
import { Places } from '@shared/config/routing';

const getNavigationListFx = createEffect(getNavigationListApi);

export const $navigationListStore = createStore<NavigationList | null>(null)
  .on(getNavigationListFx.doneData, (state, result) => result)
  .on(getNavigationListFx.fail, () => null);

export const getNavigationListEvent = createEvent();

export const addFavoritesEvent = createEvent<ToggleFavoriteRequestParams>();
const addFavoritesFx = createEffect(addFavoritesApi);

export const removeFavoritesEvent = createEvent<ToggleFavoriteRequestParams>();
const removeFavoritesFx = createEffect(removeFavoritesApi);

export const getNavigationDataByEntryIdEvent = createEvent<{ entryId: string }>();
const getNavigationDataByEntryIdFx = createEffect(getNavigationEntryApi);

export const changePlaceEvent = createEvent<Places>();
export const $place = createStore<Places>(Places.Root).on(
  changePlaceEvent,
  (state, place) => place,
);

export const changePathInFolderEvent = createEvent<string>();
export const $pathInFolder = createStore<string>('')
  .on(getNavigationDataByEntryIdFx.doneData, (state, navItem) => navItem.key)
  .on(changePathInFolderEvent, (state, path) => path);

export const changeParamsEvent = createEvent<NavigationParams>();
export const $navigationParams = createStore<NavigationParams | null>(null).on(
  changeParamsEvent,
  (state, params) => params,
);

export const $error = createStore<string | null>(null)
  .on(getNavigationListFx.failData, () => NAVIGATION_ERROR)
  .on(getNavigationDataByEntryIdFx.failData, () => NAVIGATION_ERROR)
  .reset(getNavigationListFx.done);

export const $pending = getNavigationListFx.pending;

sample({
  clock: getNavigationListEvent,
  source: { navParams: $navigationParams, place: $place, pathInFolder: $pathInFolder },
  fn: source => ({
    ...(source.navParams as NavigationParams),
    path: source.pathInFolder,
    place: source.place,
  }),
  target: getNavigationListFx,
});

sample({
  clock: getNavigationDataByEntryIdEvent,
  target: getNavigationDataByEntryIdFx,
});

sample({
  clock: getNavigationDataByEntryIdFx.doneData,
  source: { navParams: $navigationParams, place: $place },
  fn: (source, navEntry): NavigationListRequestParams => ({
    ...(source.navParams as NavigationParams),
    path: navEntry.key,
    place: source.place,
  }),
  target: getNavigationListFx,
});

sample({
  clock: addFavoritesEvent,
  target: addFavoritesFx,
});

sample({
  clock: addFavoritesFx.doneData,
  source: { navParams: $navigationParams, place: $place, pathInFolder: $pathInFolder },
  fn: (source): NavigationListRequestParams => ({
    ...(source.navParams as NavigationParams),
    path: source.pathInFolder,
    place: source.place,
  }),
  target: getNavigationListFx,
});

sample({
  clock: removeFavoritesEvent,
  target: removeFavoritesFx,
});

sample({
  clock: removeFavoritesFx.doneData,
  source: { navParams: $navigationParams, place: $place, pathInFolder: $pathInFolder },
  fn: (source): NavigationListRequestParams => ({
    ...(source.navParams as NavigationParams),
    path: source.pathInFolder,
    place: source.place,
  }),
  target: getNavigationListFx,
});
