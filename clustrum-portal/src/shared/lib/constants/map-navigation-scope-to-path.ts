import { NavigationScope } from './navigation-scope';
import { ROUTES } from './routes';

export const MAP_NAVIGATION_SCOPE_TO_PATH = {
  [NavigationScope.Connection]: ROUTES.connections,
  [NavigationScope.Dash]: ROUTES.dashboardsId,
  [NavigationScope.Dataset]: ROUTES.datasetsId,
  [NavigationScope.Widget]: ROUTES.wizard,
  [NavigationScope.Folder]: '',
};
