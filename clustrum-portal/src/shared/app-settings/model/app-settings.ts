import { createEvent, createStore } from 'effector';
import { AppSettings } from '../types';
import { DEFAULT_ENV_VARIABLES } from '../lib/constants';

const getInitialConfig = (): AppSettings => {
  const biHost = process.env.REACT_APP_CLUSTRUM_BI_HOST ?? DEFAULT_ENV_VARIABLES.biHost;
  const portalHost =
    process.env.REACT_APP_CLUSTRUM_PORTAL_HOST ?? DEFAULT_ENV_VARIABLES.portalHost;
  const exportHost =
    process.env.REACT_APP_CLUSTRUM_EXPORT_HOST ?? DEFAULT_ENV_VARIABLES.exportHost;
  const systemTitle = BUILD_SETTINGS.isLib ? '' : BUILD_SETTINGS.systemTitle;

  return {
    theme: {
      appWidgets: {
        tableWidget: {
          cell: {
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
        },
      },
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
        font: "'Inter', 'Open Sans', 'Helvetica Neue', Arial, Helvetica",
      },
      layout: {
        backgroundContentColor: '#fff',
        backgroundPanelColor: '#f5f5f5',
        showBreadcrumbs: true,
        colorAccent: '#ffd700',
      },
      filters: {
        backgroundFilterColor: 'rgba(0, 0, 0, 0)',
        borderFilterColor: 'rgba(0, 0, 0, 0)',
        labelFilterColor: '#909EB4',
        labelShadingColor: 'rgba(0, 0, 0, 0)',
        labelFontWeight: '400',
        labelFontSize: '14px',
        labelFontFamily:
          "'Golos Text', 'Inter', 'Open Sans', 'Helvetica Neue', 'Arial', 'Helvetica'",
        labelLineHeight: '21px',
        textAlign: 'left',
        controlFontSize: '16px',
        controlLineHeight: '24px',
        controlFontFamily:
          "'Golos Text', 'Inter', 'Open Sans', 'Helvetica Neue', 'Arial', 'Helvetica'",
        controlFontWeight: '400',
        controlBorderRadius: '4px',
        controlBorderColor: '#D7DDE4',
        controlBorderStyle: 'solid',
        controlBorderSize: '1px',
        controlFilterColor: '#111729',
      },
      widget: {
        borderShadow: 'rgba(0, 0, 0, 0)',
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
      tabs: {
        tabType: 'card',
      },
      dashboard: {
        widget: {
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
              align: {
                string: 'left',
                date: 'middle',
                number: 'right',
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
