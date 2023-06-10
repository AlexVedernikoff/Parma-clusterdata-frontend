import { ROUTES } from '@shared/lib/constants/routes';
import { Places } from '../../../../shared/lib/constants/places';

export const MAP_PLACE_TO_ROUTE = {
  [Places.connections]: ROUTES.connections,
  [Places.dashboards]: ROUTES.dashboards,
  [Places.datasets]: ROUTES.datasets,
  [Places.root]: ROUTES.navigation,
  [Places.favorites]: ROUTES.favorites,
  [Places.widgets]: ROUTES.widgets,
};

export const MATCH_PLACE_TO_ROUTE = {
  [Places.connections]: [ROUTES.connections, ROUTES.connectionsInFolder],
  [Places.dashboards]: [ROUTES.dashboards, ROUTES.dashboardsInFolder],
  [Places.datasets]: [ROUTES.datasets, ROUTES.datasetsInFolder],
  [Places.root]: [ROUTES.root, ROUTES.navigation, ROUTES.navigationId],
  [Places.favorites]: [ROUTES.favorites, ROUTES.favoritesId],
  [Places.widgets]: [ROUTES.widgets, ROUTES.widgetsInFolder],
};
