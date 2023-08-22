import { VISUALIZATION_TYPES } from '../constants';

import {
  CLEAR_VISUALIZATION,
  RESET_VISUALIZATION,
  SET_CLUSTER_PRECISION,
  SET_COLORS,
  SET_COORD_TYPE,
  SET_DIAGRAM_MAGNITUDE,
  SET_EXPORT_LIMIT,
  SET_FILTERS,
  SET_MAP_LAYER_OPACITY,
  SET_NEED_TOTAL,
  SET_NEED_STEPPED_LAYOUT,
  SET_STEPPED_LAYOUT_INDENTATION,
  SET_NEED_UNIQUE_ROWS,
  SET_NULL_ALIAS,
  SET_PAGINATE_INFO,
  SET_SORT,
  SET_TITLE_LAYER_SOURCE,
  SET_VISUALIZATION,
  SET_VISUALIZATION_PLACEHOLDER_ITEMS,
  SET_VISUALIZATION_TYPE,
  UPDATE_FILTER,
  SET_ORDER_BY,
} from '../actions';
import { NULL_ALIAS_DEFAULT_VALUE } from '../../kamatech_modules/@kamatech-data-ui/chartkit/lib/components/Widget/Table/NullAlias';

// Reducers

const defaultSteppedLayoutIndentation = 10;

const initialState = {
  visualizationType: VISUALIZATION_TYPES[0],
  visualization: null,
  filters: [],
  colors: [],
  sort: [],
  coordType: '',
  titleLayerSource: '',
  clusterPrecision: 0,
  nullAlias: NULL_ALIAS_DEFAULT_VALUE,
  diagramMagnitude: '',
  mapLayerOpacity: 0,
  needUniqueRows: false,
  needTotal: false,
  needSteppedLayout: false,
  steppedLayoutIndentation: defaultSteppedLayoutIndentation,
  paginateInfo: {
    page: 0,
    pageSize: 150,
  },
  exportLimit: 10000,
  orderBy: null,
};

export function visualization(state = initialState, action) {
  switch (action.type) {
    case RESET_VISUALIZATION: {
      return initialState;
    }
    case SET_VISUALIZATION_TYPE: {
      const { visualizationType } = action;

      return {
        ...state,
        visualizationType,
      };
    }
    case CLEAR_VISUALIZATION: {
      const { visualization } = state;

      visualization.placeholders.forEach(placeholder => {
        placeholder.items = [];
      });

      return {
        ...state,
        visualization: { ...visualization },
        filters: [],
        colors: [],
        sort: [],
        coordType: '',
        titleLayerSource: '',
        clusterPrecision: 0,
        nullAlias: NULL_ALIAS_DEFAULT_VALUE,
        needUniqueRows: false,
        needTotal: false,
        needSteppedLayout: false,
        steppedLayoutIndentation: defaultSteppedLayoutIndentation,
        paginateInfo: {},
        exportLimit: 10000,
        orderBy: {},
      };
    }
    case SET_VISUALIZATION: {
      const { visualization } = action;
      const { visualization: oldVisualization } = state;

      const { id } = visualization;

      let { colors, sort, clusterPrecision } = state;

      if (oldVisualization) {
        const { id: oldId } = oldVisualization;

        const transition = `${oldId}-${id}`;

        const placeholders = visualization.placeholders;
        const oldPlaceholders = oldVisualization.placeholders;

        // Опишем как будет происходит кроссекционность при изменении визуализации
        switch (transition) {
          // В этом переходе ограничения на поля в секциях эквивалентны
          case 'line-area':
          case 'line-area100p':
          case 'line-column':
          case 'line-column100p':
          case 'line-treemap':
          case 'area-line':
          case 'area100p-line':
          case 'area-column':
          case 'area100p-column':
          case 'column-line':
          case 'column100p-line':
          case 'column-area':
          case 'column100p-area':
          case 'column-area100p':
          case 'column100p-area100p':
          case 'pie-line':
          case 'pie-area':
          case 'pie-area100p':
          case 'pie-column':
          case 'pie-column100p':
          case 'treemap-line':
          case 'treemap-area':
          case 'treemap-area100p':
          case 'treemap-column':
          case 'treemap-column100p':
            if (oldPlaceholders[0].items.length) {
              placeholders[0].items = [oldPlaceholders[0].items[0]];
            }

            placeholders[1].items = oldPlaceholders[1].items;
            break;

          case 'area-treemap':
          case 'area100p-treemap':
          case 'column-treemap':
          case 'column100p-treemap':
          case 'pie-treemap':
            if (oldPlaceholders[0].items.length) {
              placeholders[0].items = [oldPlaceholders[0].items[0]];
            }

            if (oldPlaceholders[1].items.length) {
              placeholders[1].items = [oldPlaceholders[1].items[0]];
            }

            break;

          // В pie может быть только 1 измерение и 1 показатель
          // В scatter может быть только по 1 показателю или измерению
          case 'line-pie':
          case 'area-pie':
          case 'area100-pie':
          case 'column-pie':
          case 'column100-pie':
          case 'treemap-pie':
          case 'line-scatter':
          case 'area-scatter':
          case 'area100p-scatter':
          case 'column-scatter':
          case 'column100p-scatter':
          case 'pie-scatter':
          case 'treemap-scatter':
            if (oldPlaceholders[0].items.length) {
              placeholders[0].items = [oldPlaceholders[0].items[0]];
            }

            if (oldPlaceholders[1].items.length) {
              placeholders[1].items = [oldPlaceholders[1].items[0]];
            }
            break;

          // При переходе из scatter измерение (если есть) переходит в X/измерения, показатель (если есть) в Y/показатель
          case 'scatter-line':
          case 'scatter-area':
          case 'scatter-area100p':
          case 'scatter-column':
          case 'scatter-column100p':
          case 'scatter-pie':
          case 'scatter-treemap': {
            const items = [...oldPlaceholders[0].items, ...oldPlaceholders[1].items];
            const dimensions = items.filter(item => {
              return item.type === 'DIMENSION';
            });

            const measures = items.filter(item => {
              return item.type === 'MEASURE';
            });

            if (dimensions.length > 0) {
              placeholders[0].items = [dimensions[0]];
            }

            if (measures.length > 0) {
              placeholders[1].items = [measures[0]];
            }

            break;
          }

          // При переходе в flatTable все поля переходят в первое
          case 'line-flatTable':
          case 'area-flatTable':
          case 'area100p-flatTable':
          case 'column-flatTable':
          case 'column100p-flatTable':
          case 'pie-flatTable':
            placeholders[0].items = [
              ...oldPlaceholders[0].items,
              ...oldPlaceholders[1].items,
            ].filter(item => {
              return item.type !== 'PSEUDO';
            });
            break;

          // Из scatter аналогично, только там 3 секции
          case 'scatter-flatTable':
            placeholders[0].items = [
              ...oldPlaceholders[0].items,
              ...oldPlaceholders[1].items,
              ...oldPlaceholders[2].items,
            ];
            break;

          // При переходе в pivotTable заполняется только одно из измерений и показатели
          case 'line-pivotTable':
          case 'area-pivotTable':
          case 'area100p-pivotTable':
          case 'column-pivotTable':
          case 'column100p-pivotTable':
          case 'pie-pivotTable':
          case 'treemap-pivotTable':
            placeholders[0].items = oldPlaceholders[0].items.filter(
              item => item.type !== 'PSEUDO',
            );
            placeholders[2].items = oldPlaceholders[1].items;
            break;

          case 'scatter-pivotTable': {
            const items = [...oldPlaceholders[0].items, ...oldPlaceholders[1].items];
            const dimensions = items.filter(item => {
              return item.type === 'DIMENSION';
            });

            const measures = items.filter(item => {
              return item.type === 'MEASURE';
            });

            if (dimensions.length > 0) {
              placeholders[0].items = [dimensions[0]];
            }

            if (measures.length > 0) {
              placeholders[2].items = [measures[0]];
            }

            break;
          }

          // При переходе из flatTable из кучи выбираются первое измерение и первый показатель
          case 'flatTable-line':
          case 'flatTable-area':
          case 'flatTable-area100p':
          case 'flatTable-scatter':
          case 'flatTable-column':
          case 'flatTable-column100p':
          case 'flatTable-pie':
          case 'flatTable-treemap':
          case 'flatTable-pivotTable': {
            const dimensions = oldPlaceholders[0].items.filter(item => {
              return item.type === 'DIMENSION';
            });

            const measures = oldPlaceholders[0].items.filter(item => {
              return item.type === 'MEASURE';
            });

            if (dimensions.length > 0) {
              placeholders[0].items = [dimensions[0]];
            }

            if (transition === 'flatTable-pivotTable') {
              if (dimensions.length > 1) {
                placeholders[1].items = [dimensions[1]];
              }

              if (measures.length > 0) {
                placeholders[2].items = [measures[0]];
              }
            } else {
              if (measures.length > 0) {
                placeholders[1].items = [measures[0]];
              }
            }

            break;
          }

          // При переходе из pivotTable измерение выбирается из первых двух секций, а показатель из третьей
          case 'pivotTable-line':
          case 'pivotTable-area':
          case 'pivotTable-area100p':
          case 'pivotTable-scatter':
          case 'pivotTable-column':
          case 'pivotTable-column100p':
          case 'pivotTable-pie':
          case 'pivotTable-treemap': {
            const firstDimension = [
              ...oldPlaceholders[0].items,
              ...oldPlaceholders[1].items,
            ].filter(item => item.type !== 'PSEUDO')[0];

            const firstMeasure = oldPlaceholders[2].items[0];

            placeholders[0].items = firstDimension ? [firstDimension] : [];
            placeholders[1].items = firstMeasure ? [firstMeasure] : [];
            break;
          }

          // При переходе в flatTable все поля переходят в первое
          case 'pivotTable-flatTable':
            placeholders[0].items = [
              ...oldPlaceholders[0].items,
              ...oldPlaceholders[1].items,
              ...oldPlaceholders[2].items,
            ].filter(item => {
              return item.type !== 'PSEUDO';
            });

            break;
        }
      }

      if (!visualization.allowColors) {
        colors = [];
      } else {
        colors = [
          ...colors.filter(item => {
            return visualization.checkAllowedColors(item, visualization);
          }),
        ];
      }

      if (!visualization.allowSort) {
        sort = [];
      } else {
        sort = [
          ...sort.filter(item => {
            return visualization.checkAllowedSort(item, visualization, colors);
          }),
        ];
      }

      if (colors.length) {
        let pseudoIndex = null;
        colors.forEach((item, i) => {
          // item.pseudo для обратной совместимости
          if (item.pseudo || item.type === 'PSEUDO') {
            pseudoIndex = i;
          }

          if (item.conflict) {
            delete item.conflict;
          }
        });

        if (pseudoIndex !== null) {
          colors.splice(pseudoIndex, 1);
        }
      }

      visualization.placeholders.forEach(placeholder => {
        if (placeholder.onChange) {
          placeholder.onChange({ placeholder, visualization, colors, sort });
        }
      });

      if (visualization.onColorsChange) {
        visualization.onColorsChange({
          placeholders: visualization.placeholders,
          visualization,
          colors,
        });
      }

      return {
        ...state,
        colors: [...colors],
        sort,
        visualization,
      };
    }
    case SET_VISUALIZATION_PLACEHOLDER_ITEMS: {
      const { visualization, placeholder, items } = action;
      const { colors, sort } = state;

      placeholder.items = [...items];

      if (placeholder.onChange) {
        placeholder.onChange({ placeholder, visualization, colors, sort });
      }

      return {
        ...state,
        colors: [...colors],
        visualization: { ...visualization },
      };
    }
    case UPDATE_FILTER: {
      const { filters, filterIndex, value } = action;

      filters[filterIndex] = value;

      return {
        ...state,
        filters: [...filters],
      };
    }
    case SET_FILTERS: {
      const { filters } = action;

      return {
        ...state,
        filters: [...filters],
      };
    }
    case SET_COLORS: {
      const { colors } = action;
      const { visualization } = state;

      if (visualization && visualization.onColorsChange) {
        visualization.onColorsChange({
          placeholders: visualization.placeholders,
          colors,
          visualization,
        });
      }

      return {
        ...state,
        colors: [...colors],
      };
    }
    case SET_SORT: {
      const { sort } = action;

      return {
        ...state,
        sort: [...sort],
      };
    }
    case SET_COORD_TYPE: {
      const { coordType } = action;

      return {
        ...state,
        coordType: coordType,
      };
    }
    case SET_TITLE_LAYER_SOURCE: {
      const { titleLayerSource } = action;

      return {
        ...state,
        titleLayerSource: titleLayerSource,
      };
    }
    case SET_CLUSTER_PRECISION: {
      const { clusterPrecision } = action;

      return {
        ...state,
        clusterPrecision: clusterPrecision,
      };
    }
    case SET_NULL_ALIAS: {
      const { nullAlias } = action;

      return {
        ...state,
        nullAlias: nullAlias,
      };
    }
    case SET_NEED_UNIQUE_ROWS: {
      const { needUniqueRows } = action;

      return {
        ...state,
        needUniqueRows: needUniqueRows,
      };
    }
    case SET_NEED_TOTAL: {
      const { needTotal } = action;

      return {
        ...state,
        needTotal: needTotal,
      };
    }
    case SET_NEED_STEPPED_LAYOUT: {
      const { needSteppedLayout } = action;

      return {
        ...state,
        needSteppedLayout,
      };
    }
    case SET_STEPPED_LAYOUT_INDENTATION: {
      const { steppedLayoutIndentation } = action;

      return {
        ...state,
        steppedLayoutIndentation,
      };
    }
    case SET_PAGINATE_INFO: {
      const { paginateInfo } = action;

      return {
        ...state,
        paginateInfo: paginateInfo,
      };
    }

    case SET_ORDER_BY: {
      const { orderBy } = action;

      return {
        ...state,
        orderBy: orderBy,
      };
    }

    case SET_DIAGRAM_MAGNITUDE: {
      const { diagramMagnitude } = action;

      return {
        ...state,
        diagramMagnitude: diagramMagnitude,
      };
    }

    case SET_MAP_LAYER_OPACITY: {
      const { mapLayerOpacity } = action;

      return {
        ...state,
        mapLayerOpacity,
      };
    }

    case SET_EXPORT_LIMIT: {
      const { exportLimit } = action;

      return {
        ...state,
        exportLimit,
      };
    }

    default:
      return state;
  }
}

// Selectors

export const selectVisualizationType = state => state.visualization.visualizationType;
export const selectVisualization = state => state.visualization.visualization;
export const selectFilters = state => state.visualization.filters;
export const selectColors = state => state.visualization.colors;
export const selectSort = state => state.visualization.sort;
export const selectCoordType = state => state.visualization.coordType;
export const selectTitleLayerSource = state => state.visualization.titleLayerSource;
export const selectClusterPrecision = state => state.visualization.clusterPrecision;
export const selectNullAlias = state => state.visualization.nullAlias;
export const selectNeedUniqueRows = state => state.visualization.needUniqueRows;
export const selectNeedTotal = state => state.visualization.needTotal;
export const selectNeedSteppedLayout = state => state.visualization.needSteppedLayout;
export const selectSteppedLayoutIndentation = state =>
  state.visualization.steppedLayoutIndentation;
export const selectPaginateInfo = state => state.visualization.paginateInfo;
export const selectOrderBy = state => state.visualization.orderBy;
export const selectDiagramMagnitude = state => state.visualization.diagramMagnitude;
export const selectMapLayerOpacity = state => state.visualization.mapLayerOpacity;
export const selectExportLimit = state => state.visualization.exportLimit;
