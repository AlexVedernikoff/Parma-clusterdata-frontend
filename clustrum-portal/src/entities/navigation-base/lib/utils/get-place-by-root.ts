import { Places } from '@shared/config/routing';
import { Roots } from '../constants';

export const getPlaceByRoot = (root?: string): Places => {
  switch (root) {
    case Roots.Connections:
    case Roots.ConnectionsInFolder:
      return Places.Connections;
    case Roots.Dashboards:
    case Roots.DashboardsInFolder:
      return Places.Dashboards;
    case Roots.Datasets:
    case Roots.DatasetsInFolder:
      return Places.Datasets;
    case Roots.Favorites:
      return Places.Favorites;
    case Roots.Navigation:
      return Places.Root;
    case Roots.Widgets:
    case Roots.WidgetsInFolder:
      return Places.Widgets;
    default:
      return Places.Root;
  }
};
