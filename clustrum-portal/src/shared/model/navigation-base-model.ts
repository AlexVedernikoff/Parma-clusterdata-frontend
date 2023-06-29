import { createEvent, createStore, sample } from 'effector';
import { navigationEntryModel } from '../api/navigation/navigation-entry';
import { removeFavoritesModel } from '../api/navigation/navigation-remove-favorites';
import { addFavoritesModel } from '../api/navigation/navigation-add-favorites';
import {
  NavigationListRequestParams,
  navigationListModel,
} from '../api/navigation/navigation-list';
import { Places } from '../lib/constants/places';
import { NAVIGATION_ERROR } from '../lib/constants/navigation-error';

interface NavigationParams {
  page: number | null;
  pageSize: number;
}

export const { $navigationListStore, getNavigationListFx } = navigationListModel();
export const {
  getNavigationEntryFx,
  getNavigationEntryEvent: getNavigationDataByEntryIdEvent,
  $navigationEntryStore,
} = navigationEntryModel();
export const { removeFavoritesFx, removeFavoritesEvent } = removeFavoritesModel();
export const { addFavoritesFx, addFavoritesEvent } = addFavoritesModel();

export const changePathInFolderEvent = createEvent<string>();
export const $pathInFolder = createStore<string>('')
  .on(getNavigationEntryFx.doneData, (state, navItem) => navItem.key)
  .on(changePathInFolderEvent, (state, path) => path);

export const changePlaceEvent = createEvent();
export const $place = createStore<Places>(Places.Root).on(
  changePlaceEvent,
  (state, place) => place,
);

export const changeParamsEvent = createEvent<NavigationParams>();
export const $navigationParams = createStore<NavigationParams | null>(null).on(
  changeParamsEvent,
  (state, params) => params,
);

export const getNavigationListEvent = createEvent();

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

export const $error = createStore<string | null>(null)
  .on(getNavigationListFx.failData, () => NAVIGATION_ERROR)
  .on(getNavigationEntryFx.failData, () => NAVIGATION_ERROR)
  .reset(getNavigationListFx.done);

sample({
  clock: getNavigationDataByEntryIdEvent,
  target: getNavigationEntryFx,
});

sample({
  clock: getNavigationEntryFx.doneData,
  source: { navParams: $navigationParams, place: $place },
  fn: (source, navEntry): NavigationListRequestParams => ({
    ...(source.navParams as NavigationParams),
    path: navEntry.key,
    place: source.place,
  }),
  target: getNavigationListFx,
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
  clock: removeFavoritesFx.doneData,
  source: { navParams: $navigationParams, place: $place, pathInFolder: $pathInFolder },
  fn: (source): NavigationListRequestParams => ({
    ...(source.navParams as NavigationParams),
    path: source.pathInFolder,
    place: source.place,
  }),
  target: getNavigationListFx,
});
