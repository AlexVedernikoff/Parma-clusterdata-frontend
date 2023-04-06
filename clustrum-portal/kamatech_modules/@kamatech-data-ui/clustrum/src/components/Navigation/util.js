import { PLACE } from './constants';

export const isRoot = place => {
  return place === PLACE.ROOT || place === PLACE.ORIGIN_ROOT;
};

export const mapPlace = place => {
  return isRoot(place) ? PLACE.ORIGIN_ROOT : place;
};

export const mapPlaceBackward = place => {
  return isRoot(place) ? PLACE.ROOT : place;
};

const isEntryActiveByType = (includeType, type) => {
  return [].concat(includeType).includes(type);
};

export const checkEntryActivity = (clickableScope, includeType, excludeType) => {
  return includeType || excludeType
    ? ({ scope, type }) => {
        return (
          scope === 'folder' ||
          ((clickableScope ? clickableScope === scope : true) &&
            ((Boolean(includeType) && isEntryActiveByType(includeType, type)) ||
              (Boolean(excludeType) && !isEntryActiveByType(excludeType, type))))
        );
      }
    : undefined;
};
