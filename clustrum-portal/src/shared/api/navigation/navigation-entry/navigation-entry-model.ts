import {
  Store,
  createEffect,
  createEvent,
  createStore,
  Event,
  Effect,
  sample,
} from 'effector';
import { NavigationEntryRequestParams } from './types/navigation-entry-request-params';
import { NavigationItem } from '../../../types/navigation-item';
import { getNavigationEntryRequest } from './get-navigation-entry-request';

interface NavigationEntryModel {
  $navigationEntryStore: Store<NavigationItem | null>;
  getNavigationEntryEvent: Event<NavigationEntryRequestParams>;
  getNavigationEntryFx: Effect<NavigationEntryRequestParams, NavigationItem, Error>;
}

export const navigationEntryModel = (): NavigationEntryModel => {
  const getNavigationEntryFx = createEffect(getNavigationEntryRequest);

  const $navigationEntryStore = createStore<NavigationItem | null>(null)
    .on(getNavigationEntryFx.doneData, (state, result) => result)
    .on(getNavigationEntryFx.fail, () => null);

  const getNavigationEntryEvent = createEvent<NavigationEntryRequestParams>();

  sample({
    clock: getNavigationEntryEvent,
    target: getNavigationEntryFx,
  });

  return {
    $navigationEntryStore,
    getNavigationEntryEvent,
    getNavigationEntryFx,
  };
};
