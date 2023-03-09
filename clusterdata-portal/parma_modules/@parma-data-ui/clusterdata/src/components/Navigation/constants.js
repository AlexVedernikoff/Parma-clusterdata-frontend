import {NAVIGATION_ROOT} from '@parma-data-ui/common/src/components/Navigation/constants';
import {DL} from '../../constants/common';

export const PLACE = {
    ORIGIN_ROOT: NAVIGATION_ROOT,
    ROOT: 'navigation',
    FAVORITES: 'favorites',
    LATEST: 'latest',
    DASHBOARDS: 'dashboards',
    DATASETS: 'datasets',
    WIDGETS: 'widgets',
    CONNECTIONS: 'connections'
};

export const PLACE_IN_FOLDER = {
    origin_root: NAVIGATION_ROOT,
    root: 'navigation',
    favorites: 'favorites',
    latest: 'latest',
    dashboards: 'dashboards_in_folder',
    datasets: 'datasets_in_folder',
    widgets: 'widgets_in_folder',
    connections: 'connections_in_folder'
};

export const QUICK_ITEMS = {
    get USER_FOLDER() {
        return DL.USER_FOLDER;
    }
};

export const PLACE_VALUES = Object.values(PLACE);

export const MAP_PLACE_TO_SCOPE = {
    [PLACE.ORIGIN_ROOT]: 'folder',
    [PLACE.ROOT]: 'folder',
    [PLACE.FAVORITES]: 'folder',
    [PLACE.DASHBOARDS]: 'dash',
    [PLACE.DATASETS]: 'dataset',
    [PLACE.WIDGETS]: 'widget',
    [PLACE.CONNECTIONS]: 'connection'
};
