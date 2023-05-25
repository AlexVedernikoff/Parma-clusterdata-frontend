import { ROUTES } from '../../../../clustrum-lib/src/shared/lib/routes';

export const matchRoutes = {
  [ROUTES.connections]: [ROUTES.connections, ROUTES.connectionsInFolder],
  [ROUTES.dashboards]: [ROUTES.dashboards, ROUTES.dashboardsInFolder],
  [ROUTES.datasets]: [ROUTES.datasets, ROUTES.datasetsInFolder],
  [ROUTES.navigation]: [ROUTES.root, ROUTES.navigation, ROUTES.navigationId],
  [ROUTES.favorites]: [ROUTES.favorites, ROUTES.favoritesId],
  [ROUTES.widgets]: [ROUTES.widgets, ROUTES.widgetsInFolder],
};
