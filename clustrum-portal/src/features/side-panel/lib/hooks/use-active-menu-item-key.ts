import { matchPath, useLocation } from 'react-router';
import { MATCH_PLACE_TO_ROUTE, MENU_ITEMS } from '../constants';
import { Places } from '@shared/config/routing/places';

export const useActiveMenuItemKey = (): string[] | undefined => {
  const location = useLocation();
  const activeItem = MENU_ITEMS.find(menuItem => {
    const place = menuItem?.key;
    return (
      place &&
      MATCH_PLACE_TO_ROUTE[place as Places].some(route =>
        matchPath(location.pathname, { exact: true, path: route }),
      )
    );
  });

  return activeItem ? [String(activeItem.key)] : undefined;
};
