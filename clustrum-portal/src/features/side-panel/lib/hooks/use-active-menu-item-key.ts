import { matchPath, useLocation } from 'react-router';
import { MATCH_ROUTES } from '../constants/match-routes';
import { MENU_ITEMS } from '../constants/menu-items';

export const useActiveMenuItemKey = (): string[] | undefined => {
  const location = useLocation();
  const activeItem = MENU_ITEMS.find(menuItem => {
    const menuItemPath = menuItem?.key;
    return (
      menuItemPath &&
      MATCH_ROUTES[menuItemPath].some(route =>
        matchPath(location.pathname, { exact: true, path: route }),
      )
    );
  });

  return activeItem ? [String(activeItem.key)] : undefined;
};
