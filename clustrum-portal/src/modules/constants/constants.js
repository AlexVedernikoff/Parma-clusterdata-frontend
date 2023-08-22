import { $appSettingsStore } from '@entities/app-settings';

export const IS_DEVELOPMENT = $appSettingsStore.getState().env === 'development';

export const IS_INTERNAL = $appSettingsStore.getState().installationType === 'internal';

export const PREFIX = IS_DEVELOPMENT || IS_INTERNAL ? '' : '/dashboards';

export const ENTRY_ID_REGEXP = /^[0-9a-z]{13}$/;

export const ITEM_TYPE = {
  TITLE: 'title',
  TEXT: 'text',
  WIDGET: 'widget',
  CONTROL: 'control',
};

export const DIALOG_TYPE = Object.assign(
  {
    TABS: 'tabs',
    CONNECTIONS: 'connections',
  },
  ITEM_TYPE,
);

export const MODE = {
  LOADING: 'loading',
  UPDATING: 'updating',
  VIEW: 'view',
  EDIT: 'edit',
  ERROR: 'error',
};

export const STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAIL: 'fail',
  DONE: 'done',
};
