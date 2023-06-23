import { ROUTES } from '@shared/lib/constants/routes';

export const MATCH_ROUTES = {
  [ROUTES.connections]: [ROUTES.connections, ROUTES.connectionsInFolder],
  [ROUTES.dashboards]: [ROUTES.dashboards, ROUTES.dashboardsInFolder],
  [ROUTES.datasets]: [ROUTES.datasets, ROUTES.datasetsInFolder],
  [ROUTES.navigation]: [ROUTES.root, ROUTES.navigation, ROUTES.navigationId],
  [ROUTES.favorites]: [ROUTES.favorites, ROUTES.favoritesId],
  [ROUTES.widgets]: [ROUTES.widgets, ROUTES.widgetsInFolder],
};
