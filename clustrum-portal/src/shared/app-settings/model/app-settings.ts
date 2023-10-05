import { createEvent, createStore } from 'effector';
import { AppSettings } from '../types';
import { DEFAULT_ENV_VARIABLES, DEFAULT_FONT_FAMILY } from '../lib/constants';

const getInitialConfig = (): AppSettings => {
  const biHost = process.env.REACT_APP_CLUSTRUM_BI_HOST ?? DEFAULT_ENV_VARIABLES.biHost;
  const portalHost =
    process.env.REACT_APP_CLUSTRUM_PORTAL_HOST ?? DEFAULT_ENV_VARIABLES.portalHost;
  const exportHost =
    process.env.REACT_APP_CLUSTRUM_EXPORT_HOST ?? DEFAULT_ENV_VARIABLES.exportHost;
  const systemTitle = BUILD_SETTINGS.isLib ? '' : BUILD_SETTINGS.systemTitle;

  return {
    theme: {
      ant: {
        colorPrimary: '#bb2649',
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: '#ff4d4f',
        colorLink: '#bb2649',
        colorSplit: 'rgba(0, 0, 0, 0.06)',
        colorBorder: 'rgba(0, 0, 0, 0.15)',
      },
      app: {
        font: DEFAULT_FONT_FAMILY,
      },
      layout: {
        backgroundContentColor: '#fff',
        backgroundPanelColor: '#f5f5f5',
        showBreadcrumbs: true,
        colorAccent: '#ffd700',
      },
      tabs: {
        tabType: 'card',
      },
      dashboard: {
        header: {
          font: {
            family:
              "'Inter', 'Open Sans', 'Helvetica Neue', Arial, Helvetica, sans-serif",
            size: '30px',
            weight: '400',
            style: 'normal',
            lineHeight: '30px',
            color: '#111729',
          },
        },
        widget: {
          table: {
            pagination: {
              defaultPageSize: 10,
              font: {
                family: DEFAULT_FONT_FAMILY,
                size: '14px',
                weight: '400',
                lineHeight: '22px',
                style: 'normal',
                color: 'rgba(0, 0, 0, 0.88)',
              },
            },
            td: {
              numberType: {
                align: 'left',
              },
              textType: {
                align: 'right',
              },
              dateType: {
                align: 'center',
              },
            },
            total: {
              backgroundColor: 'transparent',
              font: {
                family: "'Inter', 'Open Sans', 'Helvetica Neue', Arial, Helvetica",
                size: '13px',
                weight: '600',
                style: 'normal',
                lineHeight: '1.5',
                color: '#000',
              },
            },
          },
          pivotTable: {
            th: {
              font: {
                family: "'Inter', 'Open Sans', 'Helvetica Neue', Arial, Helvetica",
                size: '13px',
                weight: '600',
                style: 'normal',
                lineHeight: '1.2',
                color: '#000',
              },
            },
            td: {
              numberType: {
                align: 'left',
              },
              textType: {
                align: 'right',
              },
              dateType: {
                align: 'center',
              },
              font: {
                family: "'Inter', 'Open Sans', 'Helvetica Neue', Arial, Helvetica",
                size: '13px',
                weight: '400',
                style: 'normal',
                lineHeight: '1.2',
                color: '#000',
              },
            },
            total: {
              backgroundColor: 'transparent',
              font: {
                family: "'Inter', 'Open Sans', 'Helvetica Neue', Arial, Helvetica",
                size: '13px',
                weight: '400',
                style: 'normal',
                lineHeight: '1.2',
                color: '#000',
              },
            },
            layout: {
              tableBorderColor: 'transparent',
            },
          },
          filter: {
            wrapper: {
              background: {
                color: '#fff',
              },
              border: {
                color: 'rgba(0, 0, 0, 0.06);',
              },
              boxShadow: '0px 2px 4px rgba(76, 77, 75, 0.1)',
              textAlign: 'left',
            },
            label: {
              font: {
                family: "'Inter', 'Open Sans', 'Helvetica Neue', Arial, Helvetica",
                size: '14px',
                weight: '400',
                style: 'normal',
                lineHeight: '22px',
                color: '#252625',
              },
              shadingColor: '#fff',
            },
            control: {
              font: {
                family: "'Inter', 'Open Sans', 'Helvetica Neue', Arial, Helvetica",
                size: '14px',
                weight: '400',
                style: 'normal',
                lineHeight: '22px',
                color: '#252625',
              },
              border: {
                radius: '4px',
                color: '#D7DDE4',
                style: 'solid',
                size: '1px',
              },
            },
          },
        },
      },
    },
    env: 'development',
    appEnv: 'development',
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
    hideDashExport: null,
    enableCaching: null,
    cacheMode: null,
    exportMode: null,
    stateUuid: '',
    currentCloudFolderId: 'b1gv7h11svmfudripdnc',
    clouds: [],
    title: systemTitle,
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
      logoText: systemTitle,
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
          title: systemTitle,
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
    mapLayerSource: 'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };
};

export const setAppSettingsEvent = createEvent<Partial<AppSettings>>();

export const $appSettingsStore = createStore<AppSettings>(
  getInitialConfig(),
).on(setAppSettingsEvent, (state, payload) => ({ ...state, ...payload }));
