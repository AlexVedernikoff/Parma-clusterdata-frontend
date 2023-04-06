import { replace } from 'connected-react-router';

import * as actionTypes from '../constants/actionTypes';
import { ITEM_TYPE, MODE } from '../../modules/constants/constants';
import { CONTROL_SOURCE_TYPE } from '../../constants/constants';
import SchemeConverter from '../../modules/schemeConverter/schemeConverter';
import { getNavigationPathFromKey } from '../../helpers/utils-dash';

export const setMode = mode => ({ type: actionTypes.SET_MODE, payload: { mode } });

export const setErrorMode = () => ({ type: actionTypes.SET_ERROR_MODE });

export const cancelEditMode = () => ({ type: actionTypes.CANCEL_EDIT_MODE, payload: { mode: MODE.VIEW } });

export const load = () => {
  return async function(dispatch, getState, { sdk }) {
    try {
      dispatch({ type: actionTypes.LOAD_DASH, payload: { mode: MODE.LOADING } });

      const {
        router: { location },
      } = getState();
      const { pathname, search } = location;

      const entryId = pathname.match(/[^\/]*$/)[0];

      if (entryId === 'new') {
        return;
      }

      const searchParams = new URLSearchParams(search);
      const stateUuid = searchParams.get('state-uuid');

      const [entry, hashData] = await Promise.all([
        sdk.getEntry({ entryId, includePermissionsInfo: true, includeLinks: true }),
        stateUuid ? sdk.getDashState({ uuid: stateUuid }).catch(error => console.error('STATE_LOAD', error)) : null,
      ]);

      let data = entry.data;
      let convertedData;

      if (SchemeConverter.isUpdateNeeded(data)) {
        dispatch({ type: actionTypes.LOAD_DASH, payload: { mode: MODE.UPDATING } });
        data = await SchemeConverter.update(data);
        convertedData = data;
      }

      let hashState = {};

      if (hashData) {
        const { data } = hashData;
        const parsedData = JSON.parse(data);

        if (parsedData && parsedData.params) {
          hashState = parsedData.params;
        }
      }

      const pageId = data.pages[0].id;
      let tabId = searchParams.has('tab') ? searchParams.get('tab') : data.pages[0].tabs[0].id;

      if (data.pages[0].tabs.findIndex(({ id }) => id === tabId) === -1) {
        tabId = data.pages[0].tabs[0].id;
        searchParams.delete('tab');
        dispatch(replace({ ...location, search: `?${searchParams.toString()}` }));
      }

      const mode = data.pages[0].tabs.length === 1 && !data.pages[0].tabs[0].items.length ? MODE.EDIT : MODE.VIEW;

      dispatch({
        type: actionTypes.LOAD_DASH_SUCCESS,
        payload: {
          permissions: entry.permissions,
          navigationPath: getNavigationPathFromKey(entry.key),
          mode,
          entry,
          hashState,
          data,
          convertedData,
          pageId,
          tabId,
        },
      });
    } catch (error) {
      console.error('LOAD_DASH', error);
      dispatch({ type: actionTypes.LOAD_DASH_ERROR, payload: { mode: MODE.ERROR } });
    }
  };
};

export const save = () => {
  return async function(dispatch, getState, { sdk }) {
    try {
      const {
        entry: { entryId },
        data,
      } = getState().dash;

      const links = data.pages.reduce(
        (result, page) =>
          page.tabs.reduce(
            (result, tab) =>
              tab.items.reduce((result, item) => {
                const { type, data } = item;
                if (type === ITEM_TYPE.WIDGET) {
                  return data.reduce((result, widget) => {
                    const { uuid } = widget.data;
                    result[uuid] = uuid;
                    return result;
                  }, result);
                }
                if (type === ITEM_TYPE.CONTROL && data.sourceType === CONTROL_SOURCE_TYPE.DATASET) {
                  const { id } = data.dataset;
                  result[id] = id;
                  return result;
                }
                return result;
              }, result),
            result,
          ),
        {},
      );

      const entry = await sdk.updateDash({ entryId, data, links });

      dispatch({
        type: actionTypes.SAVE_DASH_SUCCESS,
        payload: {
          mode: MODE.VIEW,
          data: entry.data,
          convertedData: null,
          entry,
        },
      });
    } catch (error) {
      console.error('SAVE_DASH', error);
      dispatch({ type: actionTypes.SAVE_DASH_ERROR });
      throw error;
    }
  };
};

export const setPageTab = tabId => ({ type: actionTypes.SET_PAGE_TAB, payload: { tabId } });

export const openDialog = dialogType => ({ type: actionTypes.OPEN_DIALOG, payload: { openedDialog: dialogType } });

export const openItemDialog = data => ({ type: actionTypes.OPEN_ITEM_DIALOG, payload: data });

export const closeDialog = () => ({
  type: actionTypes.CLOSE_DIALOG,
  payload: { openedDialog: null, openedItemId: null, openedLayoutId: null },
});

export const openExpandedFilter = () => ({ type: actionTypes.OPEN_EXPANDED_FILTER });

export const closeExpandedFilter = () => ({ type: actionTypes.CLOSE_EXPANDED_FILTER });

export const setTabs = tabs => ({ type: actionTypes.SET_TABS, payload: tabs });

export const setSettings = settings => ({ type: actionTypes.SET_SETTINGS, payload: settings });

export const setItemData = data => ({ type: actionTypes.SET_ITEM_DATA, payload: data });

export const setCurrentTabData = data => ({ type: actionTypes.SET_CURRENT_TAB_DATA, payload: data });

export const updateCurrentTabData = data => ({ type: actionTypes.UPDATE_CURRENT_TAB_DATA, payload: data });

export const setHashState = hashState => ({ type: actionTypes.SET_HASH_STATE, payload: { hashState } });

export const toggleTableOfContent = data => ({ type: actionTypes.TOGGLE_TABLE_OF_CONTENT, payload: data });

export const setDashKitRef = dashKitRef => ({ type: actionTypes.SET_DASHKIT_REF, payload: { dashKitRef } });

export const changeNavigationPath = navigationPath => ({
  type: actionTypes.CHANGE_NAVIGATION_PATH,
  payload: { navigationPath },
});

export const resetAllFilters = () => ({ type: actionTypes.RESET_ALL_FILTERS });

export const setWidgetEditorUUID = widgetEditorUUID => ({
  type: actionTypes.SET_WIDGET_EDITOR_UUID,
  payload: { widgetEditorUUID },
});

export const setWidgetForReloadUUID = widgetForReloadUUID => ({
  type: actionTypes.SET_WIDGET_FOR_RELOAD_UUID,
  payload: { widgetForReloadUUID },
});

export const toggleWidgetVisibility = (widgetId, layoutId) => ({
  type: actionTypes.TOGGLE_WIDGET_VISIBILITY,
  payload: { widgetId, layoutId },
});

export const startExport = () => ({ type: actionTypes.START_EXPORT });
export const endExport = () => ({ type: actionTypes.END_EXPORT });
export const exportError = () => ({ type: actionTypes.EXPORT_ERROR });
export const exportStatusReset = () => ({ type: actionTypes.EXPORT_STATUS_RESET });
