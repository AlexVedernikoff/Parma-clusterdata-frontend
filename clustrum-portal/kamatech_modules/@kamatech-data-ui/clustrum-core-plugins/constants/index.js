'use strict';
const { I18n, keysets } = require('@kamatech-data-ui/clustrum-i18n');

const getError = (lang = 'ru') => {
  I18n.registerKeysets(keysets[lang]);
  const i18n = I18n.keyset('clustrum.landing.error');

  return {
    onLicenseNotAccepted: {
      errorType: 'license-not-accepted',
      title: i18n('label_title-license-not-accepted'),
    },
    onAuthFailed: {
      errorType: 'auth-failed',
      title: i18n('label_title-auth-failed'),
      description: i18n('label_description-auth-failed'),
    },
    onFail: {
      errorType: 'error',
      title: i18n('label_title-fail'),
      description: i18n('label_description-fail'),
    },
    onAuthDenied: {
      errorType: 'auth-denied',
      title: i18n('label_title-auth-denied'),
      description: i18n('label_description-auth-denied'),
    },
    onInaccessibleEntryFolder: {
      errorType: 'inaccessible-entry-folder',
      title: i18n('label_title-inaccessible-entry-folder'),
    },
    onMissingEntry: {
      errorType: 'not-found',
      title: i18n('label_title-missing-entry'),
    },
    onMissingCurrentCloudFolder: {
      errorType: 'not-found-current-cloud-folder',
      title: i18n('label_title-missing-current-cloud-folder'),
    },
    onForbiddenEntry: {
      errorType: 'no-entry-access',
      title: i18n('label_title-forbidden-entry'),
    },
    onCloudFolderAccessDenied: {
      errorType: 'cloud-folder-access-denied',
      title: i18n('label_title-cloud-folder-access-denied'),
    },
  };
};

const DEFAULT_TIMEOUT = 20000;
const TIMEOUT_10_SEC = 10000;
const TIMEOUT_60_SEC = 60000;
const TIMEOUT_120_SEC = 120000;
const TIMEOUT_300_SEC = 300000;

const PLACE = {
  ORIGIN_ROOT: 'root',
  ROOT: 'navigation',
  FAVORITES: 'favorites',
  LATEST: 'latest',
  DASHBOARDS: 'dashboards',
  DATASETS: 'datasets',
  WIDGETS: 'widgets',
  CONNECTIONS: 'connections',
};

const MAP_PLACE_TO_SCOPE = {
  [PLACE.ORIGIN_ROOT]: 'folder',
  [PLACE.ROOT]: 'folder',
  [PLACE.FAVORITES]: 'folder',
  [PLACE.DASHBOARDS]: 'dash',
  [PLACE.DATASETS]: 'dataset',
  [PLACE.WIDGETS]: 'widget',
  [PLACE.CONNECTIONS]: 'connection',
};

const SUPERUSER_SYSTEM_GROUP_ID = 'system_group:superuser';
const SUPERUSER_TOGGLE_COOKIE_NAME = 'dl_superuser_switch_mode';
const ENABLE = 'enable';

const TRUE_FLAGS = ['1', 'true', true];

module.exports = {
  getError,
  DEFAULT_TIMEOUT,
  TIMEOUT_10_SEC,
  TIMEOUT_60_SEC,
  TIMEOUT_120_SEC,
  TIMEOUT_300_SEC,
  PLACE,
  MAP_PLACE_TO_SCOPE,
  SUPERUSER_SYSTEM_GROUP_ID,
  SUPERUSER_TOGGLE_COOKIE_NAME,
  ENABLE,
  TRUE_FLAGS,
};
