import { ENTRY_TYPES, DL } from '../../constants/common';
import { PLACE_IN_FOLDER } from '../../components/Navigation/constants.js';

const navigateHelper = {
  redirectUrlSwitcher({ entryId, scope, type }, place) {
    const endpoints = DL.ENDPOINTS;
    const defaultUrl = `${DL.NAVIGATION_ENDPOINT}/${entryId}`;

    switch (scope) {
      case 'connection':
        return `${endpoints.connections}/${entryId}`;
      case 'dataset':
        return `${endpoints.dataset}/${entryId}`;
      case 'dash':
        return `${endpoints.dash}/${entryId}`;
      case 'widget':
        if (DL.IS_INTERNAL) {
          return [...ENTRY_TYPES.legacyWizard, ...ENTRY_TYPES.legacyScript].includes(type)
            ? defaultUrl
            : `${endpoints.wizard}/${entryId}`;
        } else {
          return `${endpoints.wizard}/${entryId}`;
        }
      case 'folder':
        if (place && place.length > 1) {
          return `${endpoints[PLACE_IN_FOLDER[place]]}/${entryId}`;
        } else {
          return defaultUrl;
        }
      default:
        return defaultUrl;
    }
  },
  open(entry) {
    const url = this.redirectUrlSwitcher(entry);
    window.location.assign(url);
  },
  openNavigation() {
    window.location.assign(DL.NAVIGATION_ENDPOINT);
  },
  openPlace(entry) {
    const url = this.redirectToPlace(entry);
    window.location.assign(url);
  },
  redirectToPlace({ scope }) {
    const endpoints = DL.ENDPOINTS;
    const defaultUrl = DL.NAVIGATION_ENDPOINT;

    switch (scope) {
      case 'connection':
        return endpoints.connections;
      case 'dataset':
        return endpoints.dataset;
      case 'dash':
        return DL.IS_INTERNAL ? `${endpoints.dash}/dashboards` : endpoints.dash;
      case 'widget':
        return endpoints.widgets;
      default:
        return defaultUrl;
    }
  },
};

export default navigateHelper;
