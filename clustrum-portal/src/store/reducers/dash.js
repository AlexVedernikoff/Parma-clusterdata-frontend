import update from 'immutability-helper';
import pick from 'lodash/pick';
import Hashids from 'hashids';
import { LOCATION_CHANGE } from 'connected-react-router';

import DashKit from 'dashboard';

import * as actionTypes from '../constants/actionTypes';
import { MODE } from '../../modules/constants/constants';
import { LAYOUT_ID } from '../../constants/constants';
import { ExportStatusEnum } from '../../../kamatech_modules/kamatech-ui/enums/export-status.enum';

const TAB_PROPERTIES = ['id', 'title', 'items', 'layout', 'filtersLayout', 'ignores', 'aliases'];

const initialState = {
  mode: MODE.LOADING,

  entry: null,
  data: null,

  permissions: null,
  navigationPath: null,

  // для случая, когда конфиг обновлялся, и в режиме редактирования нужно сразу показывать активную Сохранить,
  // и при Отмене переключаться на конвертированную data, а не на ту, что в entry
  convertedData: null,

  pageId: null,
  tabId: null,

  hashState: null,

  openedDialog: null,
  openedItemId: null,
  openedLayoutId: null,

  showTableOfContent: false,

  dashKitRef: null,

  widgetEditorUUID: '',
  widgetForReloadUUID: '',
};

function dash(state = initialState, action) {
  const { entry, data, pageId, tabId } = state;

  const pageIndex = data ? data.pages.findIndex(({ id }) => id === pageId) : -1;
  const page = pageIndex === -1 ? null : data.pages[pageIndex];

  const tabIndex = page === null ? -1 : page.tabs.findIndex(({ id }) => id === tabId);
  const tab = tabIndex === -1 ? null : page.tabs[tabIndex];

  switch (action.type) {
    case actionTypes.LOAD_DASH:
    case actionTypes.LOAD_DASH_SUCCESS:
    case actionTypes.LOAD_DASH_ERROR:
    case actionTypes.SAVE_DASH_SUCCESS:
    case actionTypes.SAVE_DASH_ERROR:
    case actionTypes.SET_MODE:
    case actionTypes.SET_PAGE_TAB:
    case actionTypes.OPEN_DIALOG:
    case actionTypes.CLOSE_DIALOG:
    case actionTypes.SET_DASHKIT_REF:
    case actionTypes.CHANGE_NAVIGATION_PATH:
    case actionTypes.SET_HASH_STATE:
    case actionTypes.SET_WIDGET_EDITOR_UUID:
    case actionTypes.SET_WIDGET_FOR_RELOAD_UUID:
      return { ...state, ...action.payload };
    case actionTypes.SET_ERROR_MODE:
      // TODO: может быть стоит проверять mode в Dialogs, которые ренредятся в Dash
      return { ...state, mode: MODE.ERROR, openedDialog: null, openedItemId: null };
    case actionTypes.CANCEL_EDIT_MODE:
      return {
        ...state,
        ...action.payload,
        tabId: tabIndex === -1 ? page.tabs[0].id : tabId, // (?) tabId -> page.tabs[tabIndex].id
        data: state.convertedData || entry.data,
      };
    case actionTypes.SET_SETTINGS:
      return { ...state, data: update(data, { settings: { $set: action.payload } }) };
    case actionTypes.SET_TABS:
      let counter = data.counter;

      const hashids = new Hashids(data.salt);

      const newTabs = action.payload.map(tab => (tab.id ? tab : { id: hashids.encode(++counter), ...tab }));

      let newTabId = tabId;

      if (tabIndex > newTabs.length - 1) {
        newTabId = newTabs[newTabs.length - 1].id;
      } else if (!newTabs.some(({ id }) => id === tabId)) {
        newTabId = newTabs[tabIndex].id;
      }

      return {
        ...state,
        data: update(data, {
          pages: {
            [pageIndex]: {
              tabs: { $set: newTabs },
            },
          },
          counter: { $set: counter },
        }),
        tabId: newTabId,
      };
    case actionTypes.SET_CURRENT_TAB_DATA:
      return {
        ...state,
        data: update(data, {
          pages: {
            [pageIndex]: {
              tabs: {
                [tabIndex]: {
                  $set: pick(action.payload, TAB_PROPERTIES),
                },
              },
            },
          },
        }),
      };
    case actionTypes.UPDATE_CURRENT_TAB_DATA:
      return {
        ...state,
        data: update(data, {
          pages: {
            [pageIndex]: {
              tabs: {
                [tabIndex]: {
                  $merge: pick(action.payload, TAB_PROPERTIES),
                },
              },
            },
          },
        }),
      };
    case actionTypes.SET_ITEM_DATA:
      const tabData = DashKit.setItem({
        item: {
          id: state.openedItemId,
          type: state.openedDialog,
          data: action.payload.data,
          defaults: action.payload.defaults,
          availableItems: action.payload.availableItems,
          namespace: action.payload.namespace,
        },
        config: {
          ...tab,
          salt: data.salt,
          counter: data.counter,
          [action.payload.layoutId]: tab[action.payload.layoutId] || [],
        },
        layout: action.payload.layout,
        layoutId: action.payload.layoutId || LAYOUT_ID.DASHBOARD,
      });

      return {
        ...state,
        data: update(data, {
          pages: {
            [pageIndex]: {
              tabs: {
                [tabIndex]: { $set: pick(tabData, TAB_PROPERTIES) },
              },
            },
          },
          counter: { $set: tabData.counter },
        }),
      };
    case actionTypes.OPEN_ITEM_DIALOG:
      const { id: openedItemId } = action.payload;
      const { layoutId: openedLayoutId } = action.payload;
      const { type: openedDialog } = tab.items.find(({ id }) => id === openedItemId);

      return {
        ...state,
        openedItemId,
        openedDialog,
        openedLayoutId,
      };
    case actionTypes.OPEN_EXPANDED_FILTER:
      return {
        ...state,
        isExpandedFilterOpen: true,
      };
    case actionTypes.CLOSE_EXPANDED_FILTER:
      return {
        ...state,
        isExpandedFilterOpen: false,
      };
    case actionTypes.TOGGLE_TABLE_OF_CONTENT:
      return {
        ...state,
        showTableOfContent: action.payload,
      };
    case LOCATION_CHANGE:
      const {
        location: { search },
      } = action.payload;
      const searchParams = new URLSearchParams(search);
      return {
        ...state,
        tabId: searchParams.get('tab') || (page && page.tabs[0].id) || null,
      };
    case actionTypes.RESET_ALL_FILTERS:
      return {
        ...state,
        hashState: {},
      };
    case actionTypes.TOGGLE_WIDGET_VISIBILITY:
      const layoutId = action.payload.layoutId;
      const layoutIndex = tab[layoutId].findIndex(l => l.i === action.payload.widgetId);
      const layoutItem = tab[layoutId][layoutIndex];
      return {
        ...state,
        data: update(data, {
          pages: {
            [pageIndex]: {
              tabs: {
                [tabIndex]: {
                  [layoutId]: {
                    [layoutIndex]: {
                      $merge: { isHidden: !layoutItem.isHidden },
                    },
                  },
                },
              },
            },
          },
        }),
      };
    case actionTypes.START_EXPORT:
      return {
        ...state,
        exportStatus: ExportStatusEnum.PENDING,
      };
    case actionTypes.END_EXPORT:
      return {
        ...state,
        exportStatus: ExportStatusEnum.SUCCESS,
      };
    case actionTypes.EXPORT_ERROR:
      return {
        ...state,
        exportStatus: ExportStatusEnum.ERROR,
      };
    case actionTypes.EXPORT_STATUS_RESET:
      return {
        ...state,
        exportStatus: null,
      };
    default:
      return state;
  }
}

export default dash;
