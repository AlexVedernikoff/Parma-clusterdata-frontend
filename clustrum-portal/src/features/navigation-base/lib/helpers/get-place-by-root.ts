import { Places } from '../../../../shared/lib/constants/places';
import { Roots } from '../constants/roots';

export const getPlaceByRoot = (root?: string): Places => {
  switch (root) {
    case Roots.connections:
    case Roots.connections_in_folder:
      return Places.connections;
    case Roots.dashboards:
    case Roots.dashboards_in_folder:
      return Places.dashboards;
    case Roots.datasets:
    case Roots.datasets_in_folder:
      return Places.datasets;
    case Roots.favorites:
      return Places.favorites;
    case Roots.navigation:
    case undefined:
      return Places.root;
    case Roots.widgets:
    case Roots.widgets_in_folder:
      return Places.widgets;
    default:
      return Places.root;
  }
};
