import { Places } from '../../../../shared/lib/constants/places';
import { ROUTES } from '../../../../shared/lib/constants/routes';

export const MAP_PLACE_TO_PATH_IN_FOLDER = {
  [Places.root]: ROUTES.navigationId,
  [Places.favorites]: ROUTES.favoritesId,
  [Places.dashboards]: ROUTES.dashboardsInFolder,
  [Places.datasets]: ROUTES.datasetsInFolder,
  [Places.widgets]: ROUTES.widgetsInFolder,
  [Places.connections]: ROUTES.connectionsInFolder,
};
