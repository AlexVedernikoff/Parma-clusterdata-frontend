import { ROUTES } from '@shared/lib/constants/routes';
import { Places } from '@shared/lib/constants/places';

export const MAP_PLACE_TO_ROUTE = {
  [Places.Connections]: ROUTES.connections,
  [Places.Dashboards]: ROUTES.dashboards,
  [Places.Datasets]: ROUTES.datasets,
  [Places.Root]: ROUTES.navigation,
  [Places.Favorites]: ROUTES.favorites,
  [Places.Widgets]: ROUTES.widgets,
};

export const MATCH_PLACE_TO_ROUTE = {
  [Places.Connections]: [ROUTES.connections, ROUTES.connectionsInFolder],
  [Places.Dashboards]: [ROUTES.dashboards, ROUTES.dashboardsInFolder],
  [Places.Datasets]: [ROUTES.datasets, ROUTES.datasetsInFolder],
  [Places.Root]: [ROUTES.root, ROUTES.navigation, ROUTES.navigationId],
  [Places.Favorites]: [ROUTES.favorites, ROUTES.favoritesId],
  [Places.Widgets]: [ROUTES.widgets, ROUTES.widgetsInFolder],
};
