import { ROUTES } from './routes';

export enum Places {
  root = 'root',
  favorites = 'favorites',
  dashboards = 'dashboards',
  datasets = 'datasets',
  widgets = 'widgets',
  connections = 'connections',
}

export const MAP_PLACE_TO_PATH = {
  [Places.root]: [ROUTES.navigation, ROUTES.navigationId, ROUTES.root],
  [Places.favorites]: [ROUTES.favorites, ROUTES.favoritesId],
  [Places.dashboards]: [
    ROUTES.dashboards,
    ROUTES.dashboardsInFolder,
    ROUTES.dashboardsId,
  ],
  [Places.datasets]: [ROUTES.datasets, ROUTES.datasetsInFolder, ROUTES.datasetsId],
  [Places.widgets]: [ROUTES.widgets, ROUTES.widgetsInFolder, ROUTES.wizard],
  [Places.connections]: [ROUTES.connections, ROUTES.connectionsInFolder],
};
