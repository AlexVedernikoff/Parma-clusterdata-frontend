import { ROUTES } from './routes';

export enum Places {
  Root = 'root',
  Favorites = 'favorites',
  Dashboards = 'dashboards',
  Datasets = 'datasets',
  Widgets = 'widgets',
  Connections = 'connections',
}

export const MAP_PLACE_TO_PATH = {
  [Places.Root]: [ROUTES.navigation, ROUTES.navigationId, ROUTES.root],
  [Places.Favorites]: [ROUTES.favorites, ROUTES.favoritesId],
  [Places.Dashboards]: [
    ROUTES.dashboards,
    ROUTES.dashboardsInFolder,
    ROUTES.dashboardsId,
  ],
  [Places.Datasets]: [ROUTES.datasets, ROUTES.datasetsInFolder, ROUTES.datasetsId],
  [Places.Widgets]: [ROUTES.widgets, ROUTES.widgetsInFolder, ROUTES.wizard],
  [Places.Connections]: [ROUTES.connections, ROUTES.connectionsInFolder],
};
