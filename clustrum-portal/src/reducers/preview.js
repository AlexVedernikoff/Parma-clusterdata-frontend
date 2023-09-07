import lodash from 'lodash';

import sha1 from 'js-sha1';

import { RESET_PREVIEW, SET_HIGHCHARTS_WIDGET, UPDATE_PREVIEW } from '../actions';

import { versionExtractor } from '../utils/helpers';

// Reducers

const initialState = {
  config: null,
  configType: null,
  id: null,
};

export function preview(state = initialState, action = {}) {
  switch (action.type) {
    case RESET_PREVIEW: {
      return initialState;
    }
    case UPDATE_PREVIEW: {
      const {
        dataset,
        dimensions,
        measures,
        visualization,
        filters,
        colors,
        sort,
        coordType,
        titleLayerSource,
        clusterPrecision,
        nullAlias,
        needUniqueRows,
        needTotal,
        needAutoNumberingRows,
        needSteppedLayout,
        steppedLayoutIndentation,
        updates,
        previewEntryId,
        paginateInfo,
        diagramMagnitude,
        mapLayerOpacity,
        exportLimit,
        orderBy,
      } = action;

      if (previewEntryId) {
        return {
          ...state,
          previewEntryId,
        };
      } else {
        const atLeastOnePlaceholderIsFull = visualization.placeholders.some(
          placeholder => {
            return placeholder.items.length > 0;
          },
        );

        const placeholdersAreValid =
          atLeastOnePlaceholderIsFull &&
          visualization.placeholders.every(placeholder => {
            const notEmpty = !placeholder.required || placeholder.items.length > 0;
            const notConflicting = placeholder.items.every(item => !item.conflict);

            return notEmpty && notConflicting;
          });

        const filtersAreValid = filters.every(filter => {
          return filter.filter;
        });

        const colorItemsAreNotConflicting = colors.every(colorItem => {
          return !colorItem.conflict;
        });

        const sortItemsAreNotConflicting = sort.every(sortItem => {
          return !sortItem.conflict;
        });

        if (
          placeholdersAreValid &&
          filtersAreValid &&
          colorItemsAreNotConflicting &&
          sortItemsAreNotConflicting
        ) {
          const data = {
            colors: lodash.cloneDeep(colors),
            dataset,
            dimensions,
            filters: lodash.cloneDeep(filters),
            measures,
            sort: lodash.cloneDeep(sort),
            coordType,
            titleLayerSource,
            clusterPrecision,
            nullAlias,
            needUniqueRows,
            needTotal,
            needAutoNumberingRows,
            needSteppedLayout,
            steppedLayoutIndentation,
            diagramMagnitude,
            mapLayerOpacity,
            paginateInfo,
            orderBy: orderBy,
            type: 'clustrum',
            updates: lodash.cloneDeep(updates),
            visualization: lodash.cloneDeep(visualization),
            exportLimit,
          };

          const version = JSON.stringify(data, versionExtractor);
          const hash = sha1(version);

          return {
            ...state,
            hash,
            config: {
              shared: data,
            },
            configType: visualization.wizardNodeType,
          };
        } else {
          return {
            ...state,
            config: null,
            configType: null,
          };
        }
      }
    }
    case SET_HIGHCHARTS_WIDGET: {
      const { highchartsWidget } = action;

      return {
        ...state,
        highchartsWidget,
      };
    }
    default:
      return state;
  }
}

// Selectors

export const selectPreviewEntryId = state => state.preview.previewEntryId;
export const selectConfigType = state => state.preview.configType;
export const selectConfig = state => state.preview.config;
export const selectPreviewHash = state => state.preview.hash;
export const selectHighchartsWidget = state => state.preview.highchartsWidget;
