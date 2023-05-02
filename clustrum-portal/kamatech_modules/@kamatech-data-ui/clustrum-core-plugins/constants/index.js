'use strict';

const getError = () => ({
  onLicenseNotAccepted: {
    errorType: 'license-not-accepted',
    title: '',
  },
  onAuthFailed: {
    errorType: 'auth-failed',
    title: 'Что-то пошло не так',
    description: 'Пожалуйста, обратитесь в тех. поддержку',
  },
  onFail: {
    errorType: 'error',
    title: 'Что-то пошло не так',
    description: 'Пожалуйста, обратитесь в тех. поддержку',
  },
  onAuthDenied: {
    errorType: 'auth-denied',
    title: '',
    description: 'Пожалуйста, обратитесь в тех. поддержку',
  },
  onInaccessibleEntryFolder: {
    errorType: 'inaccessible-entry-folder',
    title: 'У вас нет доступа к ClusterData в этом каталоге',
  },
  onMissingEntry: {
    errorType: 'not-found',
    title: 'Не найдено',
  },
  onMissingCurrentCloudFolder: {
    errorType: 'not-found-current-cloud-folder',
    title: 'Выберите каталог для работы с ClusterData',
  },
  onForbiddenEntry: {
    errorType: 'no-entry-access',
    title: 'У вас нет прав доступа к этому объекту',
  },
  onCloudFolderAccessDenied: {
    errorType: 'cloud-folder-access-denied',
    title: 'У вас нет доступа к объектам ClusterData в этом каталоге',
  },
});

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
