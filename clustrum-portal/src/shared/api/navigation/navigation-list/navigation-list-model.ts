import { Store, createEffect, createEvent, createStore, Event, Effect } from 'effector';
import { NavigationList } from './types/navigation-list';
import { getNavigationListRequest } from './get-navigation-list-request';
import { NavigationListRequestParams } from './types/navigation-list-request-params';
import { sample } from 'lodash';

interface NavigationListModel {
  $navigationListStore: Store<NavigationList | null>;
  getNavigationListEvent: Event<NavigationListRequestParams>;
  getNavigationListFx: Effect<NavigationListRequestParams, NavigationList, Error>;
}

export const navigationListModel = (): NavigationListModel => {
  const getNavigationListFx = createEffect(getNavigationListRequest);

  const $navigationListStore = createStore<NavigationList | null>(null)
    .on(getNavigationListFx.doneData, (state, result) => result)
    .on(getNavigationListFx.fail, () => null);

  const getNavigationListEvent = createEvent<NavigationListRequestParams>();

  sample({
    clock: getNavigationListEvent,
    target: getNavigationListFx,
  });

  return {
    $navigationListStore,
    getNavigationListEvent,
    getNavigationListFx,
  };
};
