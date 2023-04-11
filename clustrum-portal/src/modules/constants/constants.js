import { ITEM_TYPE } from 'clustrum-lib/constants/constants';

export const IS_DEVELOPMENT = window.DL.env === 'development';

export const IS_INTERNAL = window.DL.installationType === 'internal';

export const PREFIX = IS_DEVELOPMENT || IS_INTERNAL ? '' : '/dashboards';

export const ENTRY_ID_REGEXP = /^[0-9a-z]{13}$/;

export const DIALOG_TYPE = Object.assign(
  {
    TABS: 'tabs',
    CONNECTIONS: 'connections',
    SETTINGS: 'settings',
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
