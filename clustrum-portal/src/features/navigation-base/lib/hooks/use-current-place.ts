import { matchPath, useLocation } from 'react-router';
import { MAP_PLACE_TO_PATH, Places } from '../../../../shared/lib/constants/places';

export const useCurrentPlace = (): Places | null => {
  const location = useLocation();
  const currentPlace = Object.values(Places).find(place =>
    MAP_PLACE_TO_PATH[place].some(route =>
      matchPath(location.pathname, { exact: true, path: route }),
    ),
  );
  return currentPlace ?? null;
};
