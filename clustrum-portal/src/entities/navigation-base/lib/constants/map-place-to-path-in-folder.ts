import { Places } from '@shared/config/routing/places';
import { ROUTES } from '@shared/config/routing/routes';

export const MAP_PLACE_TO_PATH_IN_FOLDER = {
  [Places.Root]: ROUTES.navigationId,
  [Places.Favorites]: ROUTES.favoritesId,
  [Places.Dashboards]: ROUTES.dashboardsInFolder,
  [Places.Datasets]: ROUTES.datasetsInFolder,
  [Places.Widgets]: ROUTES.widgetsInFolder,
  [Places.Connections]: ROUTES.connectionsInFolder,
};
