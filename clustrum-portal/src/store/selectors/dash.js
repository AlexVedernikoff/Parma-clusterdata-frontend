import isEqual from 'lodash/isEqual';

import { ItemType } from '@lib-shared/types';
import { MODE } from '../../modules/constants/constants';

const getCurrentPage = state => {
  const pageIndex = state.dash.data
    ? state.dash.data.pages.findIndex(({ id }) => id === state.dash.pageId)
    : -1;
  return pageIndex === -1 ? null : state.dash.data.pages[pageIndex];
};

export const getCurrentPageTabs = state => {
  const page = getCurrentPage(state);
  return page ? page.tabs : null;
};

export const getCurrentTab = state => {
  const page = getCurrentPage(state);
  const tabIndex = page ? page.tabs.findIndex(({ id }) => id === state.dash.tabId) : -1;
  return tabIndex === -1
    ? null
    : {
        ...page.tabs[tabIndex],
        salt: state.dash.data.salt,
        counter: state.dash.data.counter,
      };
};

export const isEditMode = state => state.dash.mode === MODE.EDIT;

export const canEdit = state =>
  Boolean(state.dash.permissions && state.dash.permissions.edit);

export const isDraft = state =>
  Boolean(state.dash.entry) && !isEqual(state.dash.entry.data, state.dash.data);

export const getEntryId = state => (state.dash.entry ? state.dash.entry.entryId : null);

export const getEntryTitle = state =>
  state.dash.entry ? state.dash.entry.key.match(/[^/]*$/).toString() : null;

export const getSettings = state => (state.dash.data ? state.dash.data.settings : null);

export const isDialogVisible = (state, dialogType) =>
  state.dash.openedDialog === dialogType;

export const getOpenedItem = state => {
  if (state.dash.openedItemId) {
    const item = getCurrentTab(state).items.find(
      ({ id }) => id === state.dash.openedItemId,
    );

    return item;
  }
};

export const getOpenedItemData = state => {
  const item = getOpenedItem(state);

  if (item) {
    return item.data;
  }
};

export const getOpenedItemDefaults = state => {
  const item = getOpenedItem(state);

  if (item) {
    return item.defaults;
  }
};

export const getOpenedItemAvailableItems = state => {
  const item = getOpenedItem(state);

  if (item) {
    return item.availableItems;
  }
};

export const getCurrentTabConnectableItems = state => {
  const tab = getCurrentTab(state);
  if (tab) {
    return tab.items
      .filter(({ type }) => type === ItemType.Control || type === ItemType.Widget)
      .reduce(
        (result, { id, data, type, namespace }) =>
          type === ItemType.Widget
            ? result.concat(
                data.map(({ id, data, title }) => ({ id, namespace, type, title })),
              )
            : result.concat([{ id, namespace, type, title: data.title }]),
        [],
      );
  }
};

export const getWidgetEditorUUID = state => state.dash.widgetEditorUUID;

export const getWidgetForReloadUUID = state => state.dash.widgetForReloadUUID;

export const getHashState = state => state.dash.hashState;
