import { createEvent, createStore } from 'effector';
import { AppSettings } from '../types';

const getInitialConfig = (): AppSettings => {
  const biHost = process.env.REACT_APP_CLUSTRUM_BI_HOST || '';
  const portalHost = process.env.REACT_APP_CLUSTRUM_PORTAL_HOST || '';
  const exportHost = process.env.REACT_APP_CLUSTRUM_EXPORT_HOST || '';

  const dotenv = {
    SYSTEM_TITLE: process.env.REACT_APP_CLUSTRUM_SYSTEM_TITLE || '',
    MAP_LAYER_SOURCE: 'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  return {
    env: 'development',
    appEnv: 'development',
    dotenv: dotenv,
    installationType: 'external',
    user: {
      lang: 'ru',
      login: null,
      uid: '38832482',
      avatarHost: '',
      passportHost: '',
      name: 'evg-shcherbakov',
      avatarId: '0/0-0',
    },
    hideHeader: true,
    hideSubHeader: null,
    hideTabs: null,
    hideEdit: null,
    enableCaching: null,
    cacheMode: null,
    exportMode: null,
    stateUuid: '',
    currentCloudFolderId: 'b1gv7h11svmfudripdnc',
    clouds: [],
    title: dotenv.SYSTEM_TITLE,
    endpoints: {
      charts: biHost,
      connections: `${portalHost}/connections`,
      favorites: `${portalHost}/favorites`,
      dash: `${portalHost}/dashboards`,
      dataset: `${portalHost}/datasets`,
      docsSyntax: '',
      extPassportOAuth: '',
      gateway: biHost,
      navigation: `${portalHost}/navigation`,
      support: '',
      uploader: '',
      widgets: `${portalHost}/widgets`,
      wizard: `${portalHost}/wizard`,
      card: `${portalHost}/card`,
      dashboards_in_folder: `${portalHost}/dashboards_in_folder`,
      datasets_in_folder: `${portalHost}/datasets_in_folder`,
      widgets_in_folder: `${portalHost}/widgets_in_folder`,
      connections_in_folder: `${portalHost}/connections_in_folder`,
      export: `${biHost}/export`,
      exportPdf: `${exportHost}/export`,
    },
    features: {
      logoText: dotenv.SYSTEM_TITLE,
      toggleTheme: true,
      dataset: {
        appMetricaEnabled: false,
      },
    },
    chartkit: {
      chartsEndpoint: '',
      lang: 'ru',
      config: false,
    },
    menu: {
      currentGroup: 'clustrum',
      common: [],
      groups: [
        {
          name: 'clustrum',
          title: dotenv.SYSTEM_TITLE,
          items: [
            {
              icon: 'folder',
              name: 'files',
              title: 'Все объекты',
              url: '/navigation',
            },
            {
              icon: 'favorites',
              name: 'favorites',
              title: 'Избранное',
              url: '/favorites',
            },
            {
              icon: 'connections',
              name: 'connections',
              title: 'Подключения',
              url: '/connections',
            },
            {
              icon: 'datasets',
              name: 'datasets',
              title: 'Наборы данных',
              url: '/datasets',
            },
            {
              icon: 'widgets',
              name: 'widgets',
              title: 'Элементы аналитических панелей',
              url: '/widgets',
            },
            {
              icon: 'dashboards',
              name: 'dashboards',
              title: 'Аналитические панели',
              url: '/dashboards',
            },
          ],
        },
      ],
    },
    metrikaOAuthClientId: '4f802221a95340dd9417c04bc30606b5',
  };
};

export const setAppSettingsEvent = createEvent<Partial<AppSettings>>();

export const $appSettingsStore = createStore<AppSettings>(
  getInitialConfig(),
).on(setAppSettingsEvent, (state, payload) => ({ ...state, ...payload }));
