import { matchPath, useLocation } from 'react-router';
import { menuItemsConfig } from '../../configs/menu-items-config';
import { matchRoutes } from '../constants/match-routes';

export const useActiveMenuItemKey = (): string[] | undefined => {
  const location = useLocation();
  const activeItem = menuItemsConfig.find(menuItem => {
    const menuItemPath = menuItem?.key;
    return (
      menuItemPath &&
      matchRoutes[menuItemPath].some(route => matchPath(location.pathname, { exact: true, path: route }))
    );
  });

  return activeItem ? [String(activeItem.key)] : undefined;
};
