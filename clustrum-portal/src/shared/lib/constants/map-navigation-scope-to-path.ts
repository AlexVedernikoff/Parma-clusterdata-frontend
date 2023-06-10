import { NavigationScope } from './navigation-scope';
import { ROUTES } from './routes';

export const MAP_NAVIGATION_SCOPE_TO_PATH = {
  [NavigationScope.connection]: ROUTES.connections,
  [NavigationScope.dash]: ROUTES.dashboardsId,
  [NavigationScope.dataset]: ROUTES.datasetsId,
  [NavigationScope.widget]: ROUTES.wizard,
  [NavigationScope.folder]: '',
};
