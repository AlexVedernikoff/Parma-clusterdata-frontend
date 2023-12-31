export interface AppSettings {
  env: string;
  appEnv: string;
  installationType: string;
  user: User;
  hideHeader: boolean;
  hideSubHeader: boolean | null;
  hideTabs: boolean | null;
  hideEdit: boolean | null;
  enableCaching: boolean | null;
  cacheMode: boolean | null;
  exportMode: boolean | null;
  stateUuid: string;
  currentCloudFolderId: string;
  clouds: unknown[];
  title: string;
  endpoints: Endpoints;
  features: Features;
  chartkit: Charkit;
  menu: Menu;
  metrikaOAuthClientId: string;
  mapLayerSource: string;
}

export interface User {
  lang: string;
  login: string | null;
  uid: string;
  avatarHost: string;
  passportHost: string;
  name: string;
  avatarId: string;
}

export interface Endpoints {
  charts: string;
  connections: string;
  favorites: string;
  dash: string;
  dataset: string;
  docsSyntax: string;
  extPassportOAuth: string;
  gateway: string;
  navigation: string;
  support: string;
  uploader: string;
  widgets: string;
  wizard: string;
  card: string;
  dashboards_in_folder: string;
  datasets_in_folder: string;
  widgets_in_folder: string;
  connections_in_folder: string;
  export: string;
  exportPdf: string;
}

export interface GroupItem {
  icon: string;
  name: string;
  title: string;
  url: string;
}

export interface MenuGroup {
  name: string;
  title: string;
  items: GroupItem[];
}

export interface Menu {
  currentGroup: string;
  common: unknown[];
  groups: MenuGroup[];
}

export interface Charkit {
  chartsEndpoint: string;
  lang: string;
  config: boolean;
}

export interface Features {
  logoText: string;
  toggleTheme: boolean;
  dataset: {
    appMetricaEnabled: boolean;
  };
}
