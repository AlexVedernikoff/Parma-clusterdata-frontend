import { NavigationScope } from '@clustrum-lib/shared/types';
import { ROUTES } from '@shared/config/routing/routes';

export const MAP_NAVIGATION_SCOPE_TO_PATH = {
  [NavigationScope.Connection]: ROUTES.connectionsId,
  [NavigationScope.Dash]: ROUTES.dashboardsId,
  [NavigationScope.Dataset]: ROUTES.datasetsId,
  [NavigationScope.Widget]: ROUTES.wizard,
  [NavigationScope.Folder]: '',
};
