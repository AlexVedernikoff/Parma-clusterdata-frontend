import {
  TOGGLE_NAVIGATION,
  TOGGLE_ACCESS_RIGHTS,
  TOGGLE_FULLSCREEN,
  APPLY_TEXT_FILTER,
  SET_SEARCH_PHRASE,
  SET_DEFAULT_PATH,
  SET_DEFAULTS_SET,
  RESET_SETTINGS,
} from '../actions';

// Reducers

const initialState = {
  isNavigationVisible: false,
  isAccessRightsVisible: false,

  isFullscreen: false,

  filteredDimensions: null,
  filteredMeasures: null,

  status: {
    error: null,
  },
  isLoading: false,
};

export function settings(state = initialState, action) {
  switch (action.type) {
    case RESET_SETTINGS: {
      return initialState;
    }
    case TOGGLE_NAVIGATION: {
      return {
        ...state,
        isNavigationVisible: !state.isNavigationVisible,
      };
    }
    case TOGGLE_ACCESS_RIGHTS: {
      return {
        ...state,
        isAccessRightsVisible: !state.isAccessRightsVisible,
      };
    }
    case TOGGLE_FULLSCREEN: {
      return {
        ...state,
        isFullscreen: !state.isFullscreen,
      };
    }
    case APPLY_TEXT_FILTER: {
      const { filteredDimensions, filteredMeasures } = action;

      return {
        ...state,
        filteredDimensions,
        filteredMeasures,
      };
    }
    case SET_SEARCH_PHRASE: {
      const { searchPhrase } = action;

      return {
        ...state,
        searchPhrase,
      };
    }
    case SET_DEFAULT_PATH: {
      const { defaultPath } = action;

      return {
        ...state,
        defaultPath,
      };
    }
    case SET_DEFAULTS_SET: {
      return {
        ...state,
        defaultsSet: true,
      };
    }
    default:
      return state;
  }
}

// Selectors

export const selectSettings = state => state.settings;
export const selectSearchPhrase = state => state.settings.searchPhrase;

export const selectIsNavigationVisible = state => state.settings.isNavigationVisible;
export const selectIsAccessRightsVisible = state => state.settings.isAccessRightsVisible;

export const selectIsFullscreen = state => state.settings.isFullscreen;

export const selectFilteredDimensions = state => state.settings.filteredDimensions;
export const selectFilteredMeasures = state => state.settings.filteredMeasures;

export const selectDefaultPath = state => state.settings.defaultPath;
export const selectIsDefaultsSet = state => state.settings.defaultsSet;
