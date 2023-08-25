import { MEASURE_TYPE, VISUALIZATIONS } from '../constants';
import { MapConstant } from '../../kamatech_modules/@kamatech-data-ui/chartkit/lib/components/Widget/OLMap/map-constant';
import Charts from '../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/charts/charts';

export const REQUEST_WIDGET = 'REQUEST_WIDGET';
export const RECEIVE_WIDGET = 'RECEIVE_WIDGET';

export const REQUEST_DATASET = 'REQUEST_DATASET';
export const RECEIVE_DATASET = 'RECEIVE_DATASET';
export const UPDATE_DATASET_FIELDS = 'UPDATE_DATASET_FIELDS';

export const TOGGLE_NAVIGATION = 'TOGGLE_NAVIGATION';
export const TOGGLE_ACCESS_RIGHTS = 'TOGGLE_ACCESS_RIGHTS';
export const TOGGLE_FULLSCREEN = 'TOGGLE_FULLSCREEN';

export const APPLY_TEXT_FILTER = 'APPLY_TEXT_FILTER';
export const SET_SEARCH_PHRASE = 'SET_SEARCH_PHRASE';

export const SET_VISUALIZATION_TYPE = 'SET_VISUALIZATION_TYPE';
export const CLEAR_VISUALIZATION = 'CLEAR_VISUALIZATION';
export const ACTUALIZE_VISUALIZATION = 'ACTUALIZE_VISUALIZATION';
export const SET_VISUALIZATION = 'SET_VISUALIZATION';
export const SET_VISUALIZATION_PLACEHOLDER_ITEMS = 'SET_VISUALIZATION_PLACEHOLDER_ITEMS';

export const UPDATE_FILTER = 'UPDATE_FILTER';
export const SET_FILTERS = 'SET_FILTERS';
export const SET_COLORS = 'SET_COLORS';
export const SET_SORT = 'SET_SORT';
export const SET_COORD_TYPE = 'SET_COORD_TYPE';
export const SET_TITLE_LAYER_SOURCE = 'SET_TITLE_LAYER_SOURCE';
export const SET_CLUSTER_PRECISION = 'SET_CLUSTER_PRECISION';
export const SET_NULL_ALIAS = 'SET_NULL_ALIAS';
export const SET_NEED_UNIQUE_ROWS = 'SET_NEED_UNIQUE_ROWS';
export const SET_NEED_TOTAL = 'SET_NEED_TOTAL';
export const SET_PAGINATE_INFO = 'SET_PAGINATE_INFO';
export const SET_ORDER_BY = 'SET_ORDER_BY';
export const SET_LABELS = 'SET_LABELS';
export const SET_DIAGRAM_MAGNITUDE = 'SET_DIAGRAM_MAGNITUDE';
export const SET_MAP_LAYER_OPACITY = 'SET_MAP_LAYER_OPACITY';

export const UPDATE_PREVIEW = 'UPDATE_PREVIEW';

export const SET_DEFAULT_PATH = 'SET_DEFAULT_PATH';
export const SET_DEFAULTS_SET = 'SET_DEFAULTS_SET';

export const SET_HIGHCHARTS_WIDGET = 'SET_HIGHCHARTS_WIDGET';
export const SET_EXPORT_LIMIT = 'SET_EXPORT_LIMIT';

export const RESET_PREVIEW = 'RESET_PREVIEW';
export const RESET_VISUALIZATION = 'RESET_VISUALIZATION';
export const RESET_DATASET = 'RESET_DATASET';
export const RESET_SETTINGS = 'RESET_SETTINGS';
export const RESET_WIDGET = 'RESET_WIDGET';

export const resetPreview = () => ({ type: RESET_PREVIEW });
export const resetVisualization = () => ({ type: RESET_VISUALIZATION });
export const resetDataset = () => ({ type: RESET_DATASET });
export const resetSettings = () => ({ type: RESET_SETTINGS });
export const resetWidget = () => ({ type: RESET_WIDGET });

export const resetWizard = () => dispatch => {
  // TODO почитать
  dispatch(resetPreview());
  dispatch(resetVisualization());
  dispatch(resetDataset());
  dispatch(resetSettings());
  dispatch(resetWidget());
};

export function requestDataset() {
  return {
    type: REQUEST_DATASET,
  };
}

export function receiveDataset({ dataset, measures, dimensions, updates, error }) {
  return {
    type: RECEIVE_DATASET,
    dataset,
    measures,
    dimensions,
    updates,
    error,
  };
}

export function requestUpdateWidget({ entryId, revId, data, sdk, callback }) {
  return function(dispatch) {
    return sdk
      .updateWidget({
        entryId,
        revId,
        data: Charts.lightWeightWidgetDataConfig(data),
      })
      .then(response => {
        dispatch(receiveWidget({ data: response }));

        if (callback) {
          callback(response, null);
        }
      })
      .catch(error => {
        if (error.response && error.response.status) {
          error.code = error.response.status;
        }

        dispatch(receiveWidget({ error }));

        if (callback) {
          callback(null, error);
        }
      });
  };
}

export function requestWidget() {
  return {
    type: REQUEST_WIDGET,
  };
}

export function receiveWidget({ data, error }) {
  const wizardPath = '/wizard';

  if (data && location.pathname.includes(wizardPath)) {
    const { entryId } = data;

    let targetPath = `${wizardPath}/`;

    if (location.pathname.indexOf('/preview/') !== -1) {
      targetPath += 'preview/';
    }

    targetPath += entryId;

    if (location.pathname !== targetPath) {
      history.replaceState({}, document.title, targetPath);
    }
  }

  if (error) {
    if (error.response && error.response.status) {
      error.code = error.response.status;
    }
  }

  return {
    type: RECEIVE_WIDGET,
    data,
    error,
  };
}

function sorterByLowerCase(a, b) {
  return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1;
}

function transformSchema({ schema, datasetId }) {
  const measures = [];
  const dimensions = [];

  schema.forEach((item, index) => {
    let type;
    let container;

    if (item.type === 'MEASURE') {
      type = 'measure';
      container = measures;
    } else if (item.type === 'DIMENSION') {
      type = 'dimension';
      container = dimensions;
    }

    const itemCopy = { ...item };

    itemCopy.id = `${type}-${index}`;
    if (!itemCopy.datasetId) {
      itemCopy.datasetId = datasetId;
    }
    itemCopy.className = `item ${type}-item`;

    // Итоговый cast проставляем из data_type.При этом важно сохранить тип, к которому сопоставили
    itemCopy.cast = item.cast || item.data_type;

    if (!itemCopy.hidden) {
      container.push(itemCopy);
    }
  });

  measures.sort(sorterByLowerCase);
  dimensions.sort(sorterByLowerCase);

  return { dimensions, measures };
}

function getDataset({ datasetId, widgetDataset, sdk }) {
  return sdk.bi
    .getDataSetByVersion({
      dataSetId: datasetId,
      version: 'draft',
      addLinkedDataSource: true,
    })
    .then(dataset => {
      const { result_schema: schema } = dataset;

      if (widgetDataset && widgetDataset.result_schema) {
        widgetDataset.result_schema.forEach(field => {
          if (field.local) {
            schema.push(field);
          }
        });
      }

      const { dimensions, measures } = transformSchema({ schema, datasetId });

      delete dataset.raw_schema;
      delete dataset.result_schema;
      delete dataset.rls;
      delete dataset.sources;

      return { dataset, measures, dimensions };
    });
}

export function fetchDataset({ datasetId, sdk }) {
  return function(dispatch, getState) {
    dispatch(requestDataset({ datasetId }));

    return getDataset({ datasetId, sdk })
      .then(({ dataset, measures, dimensions }) => {
        dispatch(receiveDataset({ dataset, measures, dimensions }));

        dispatch(actualizeVisualization({ dataset, measures, dimensions }));

        const datasetPath = dataset.key.replace(/[^/]+$/, '');

        dispatch(
          setDefaultPath({
            defaultPath: datasetPath,
          }),
        );

        const {
          dataset: { updates } = {},
          visualization: {
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
            paginateInfo,
            labels,
          } = {},
        } = getState();

        receiveVisualization({
          visualization,
          fields: [...dimensions, ...measures],
          filters,
          colors,
          sort,
        });
        dispatch(setVisualization({ visualization }));

        dispatch(
          updatePreview({
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
            paginateInfo,
            labels,
            updates,
          }),
        );
      })
      .catch(error => {
        dispatch(
          receiveDataset({
            error,
            dataset: {
              id: datasetId,
            },
          }),
        );
      });
  };
}

export function updateDatasetByValidation({ fields, updates, sdk } = {}) {
  return async (dispatch, getState) => {
    const {
      dataset: { dataset, updates: oldUpdates } = {},
      visualization: {
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
        paginateInfo,
        labels,
      } = {},
    } = getState();

    const { id: datasetId, result_schema: resultSchema } = dataset;

    const { placeholders } = visualization;

    try {
      const validation = await sdk.bi.validateDataSet({
        dataSetId: datasetId,
        version: 'draft',
        resultSchema,
        updates,
      });

      const { result_schema: newResultSchema } = validation;

      newResultSchema.forEach(field => {
        const oldField = resultSchema.find(oldField => oldField.guid === field.guid);

        if (oldField) {
          if (oldField.local) {
            field.local = true;
          }
        } else {
          field.local = true;
        }
      });

      let updatePreviewRequired = false;
      updates.forEach(entry => {
        if (entry.action === 'update') {
          placeholders.forEach(placeholder => {
            let placeholderUpdateRequired = false;

            placeholder.items.forEach(item => {
              if (item.guid === entry.field.guid) {
                item.title = entry.field.title;

                updatePreviewRequired = true;
                placeholderUpdateRequired = true;
              }
            });

            if (placeholderUpdateRequired) {
              dispatch(
                setVisualizationPlaceholderItems({
                  visualization,
                  placeholder,
                  items: placeholder.items,
                }),
              );
            }
          });
        }

        if (entry.action === 'delete') {
          placeholders.forEach(placeholder => {
            const usedItemIndex = placeholder.items.findIndex(item => {
              return item.guid === entry.field.guid;
            });

            if (usedItemIndex > -1) {
              placeholder.items.splice(usedItemIndex, 1);

              dispatch(
                setVisualizationPlaceholderItems({
                  visualization,
                  placeholder,
                  items: placeholder.items,
                }),
              );
            }
          });
        }
      });

      const { dimensions, measures } = transformSchema({
        schema: newResultSchema,
        datasetId,
      });

      const filteredOldUpdates = oldUpdates.filter(oldUpdate => {
        const {
          action: oldAction,
          field: { title: oldTitle, guid: oldGuid },
        } = oldUpdate;

        const duplicate = updates.some(newUpdate => {
          const {
            action: newAction,
            field: { title: newTitle, guid: newGuid },
          } = newUpdate;

          if (oldGuid === newGuid) {
            if (oldAction === newAction) {
              return true;
            }

            if (oldAction === 'delete' && newAction === 'add') {
              return true;
            }

            if (newAction === 'delete') {
              return true;
            }
          }
        });

        return !duplicate;
      });

      const fullUpdates = filteredOldUpdates.concat(updates);

      dispatch({
        type: UPDATE_DATASET_FIELDS,
        resultSchema: newResultSchema,
        dimensions,
        measures,
        updates: fullUpdates,
      });

      dispatch(
        updatePreview({
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
          paginateInfo,
          labels,
          updates: fullUpdates,
        }),
      );
    } catch (e) {
      return updates.length && updates[0].action === 'delete';
    }
  };
}

function validateItem({ fields, item, placeholder }) {
  // Провалидируем выбранные поля в секции с визуализацией
  if (!fields.length || item.local || item.type === 'PSEUDO') {
    return;
  }

  // Если есть актуальный датасет - сравниваем
  const existingField = fields.find(latestItem => {
    return latestItem.guid === item.guid;
  });

  if (!existingField) {
    item.conflict = 'not-existing';
    item.undragable = true;
  } else {
    item.conflict = null;
    item.undragable = null;
    item.title = existingField.title;
    item.cast = existingField.cast;
    item.type = existingField.type;
  }

  if (placeholder) {
    if (
      existingField &&
      placeholder.allowedTypes &&
      !placeholder.allowedTypes.has(item.type)
    ) {
      item.conflict = 'wrong-type';
      item.undragable = true;
    }
  }
}

function receiveVisualization({ visualization, fields = [], filters, colors, sort }) {
  // Находим иcпользуемый тип визуализации в доступных
  const presetVisualization = VISUALIZATIONS.find(presetVisualization => {
    return presetVisualization.id === visualization.id;
  });

  if (!presetVisualization) {
    throw new Error('Unknown visualization');
  }

  let placeholders = [...visualization.placeholders];

  //Отсортируем placeholders согласно элементам визуализации
  let placeholdersOrdered = [];
  presetVisualization.placeholders.forEach(preset => {
    let placeholder = placeholders.find(p => p.id === preset.id);
    if (placeholder) {
      placeholdersOrdered.push(placeholder);
    } else {
      placeholdersOrdered.push(preset);
    }
  });

  // Проставляем из него в сохраненный все метаданные
  placeholdersOrdered.forEach(placeholder => {
    const presetPlaceholder = presetVisualization.placeholders.find(
      p => p.id === placeholder.id,
    );

    const items = [...placeholder.items];

    // Перезаписываем метаданные плейсхолдера предопределенными — считаем их более приоритетными
    Object.assign(placeholder, presetPlaceholder);

    items.forEach(item => {
      validateItem({ fields, item, placeholder });
    });

    // Элементы записываем вновь пришедшими
    placeholder.items = items;
  });

  // Перезаписываем метаданные визуализации предопределенными — считаем их более приоритетными
  Object.assign(visualization, presetVisualization);

  // Плейсхолдеры записываем вновь пришедшими
  visualization.placeholders = placeholdersOrdered;

  if (filters && filters.length) {
    filters.forEach(item => {
      validateItem({ fields, item });
    });
  }

  if (colors && colors.length) {
    colors.forEach(item => {
      validateItem({ fields, item });
    });
  }

  if (sort && sort.length) {
    sort.forEach(item => {
      validateItem({ fields, item });
    });
  }
}

function getWidgetPermissions({ entryId, sdk }) {
  return sdk
    .getPermissions({
      entryId,
    })
    .then(({ editable }) => {
      return { editable };
    });
}

export function fetchWidget({ entryId, preview, sdk }) {
  return function(dispatch) {
    dispatch(requestWidget());

    let datasetId;
    let widget;
    let widgetDataset;
    let visualization;
    let filters;
    let colors;
    let sort;
    let coordType;
    let titleLayerSource;
    let clusterPrecision;
    let nullAlias;
    let needUniqueRows;
    let needTotal;
    let paginateInfo;
    let labels;
    let updates;
    let diagramMagnitude;
    let mapLayerOpacity;
    let exportLimit;

    sdk
      .getWidget({ entryId })
      .catch(error => {
        dispatch(receiveWidget({ error }));

        return { failed: true };
      })
      .then(data => {
        // Если произошла ошибка при загрузке виджета
        if (data.failed) {
          // Прекращаем обработку данных
          return { failed: true };
        }

        widget = data;

        ({
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
          diagramMagnitude,
          paginateInfo = { page: 1, pageSize: 10 },
          labels,
          updates,
          mapLayerOpacity,
          exportLimit,
        } = data.data);

        diagramMagnitude = diagramMagnitude || MEASURE_TYPE.ABSOLUTE;
        mapLayerOpacity = mapLayerOpacity || MapConstant.defaultRangePickerValue;

        widgetDataset = widget.data.dataset;

        const { dataset } = data.data;

        if (!dataset || !dataset.id) {
          throw new Error('Invalid widget (no dataset info)');
        }

        datasetId = dataset.id;

        return getDataset({ datasetId, widgetDataset, sdk });
      })
      .catch(error => {
        dispatch(
          receiveDataset({
            error,
            dataset: widgetDataset,
          }),
        );

        // Проставляем defaultPath независимо от датасета
        dispatch(
          setDefaultPath({
            defaultPath: window.DL.user.login ? `/Users/${window.DL.user.login}` : '/',
          }),
        );

        // Обрабатываем проставление всех метаданных виджета
        dispatch(
          receiveWidget({
            data: widget,
          }),
        );

        receiveVisualization({ visualization });

        // Проставляем визуализацию и все ее параметры (какие поля выбраны)
        dispatch(setVisualization({ visualization }));

        return { failed: true };
      })
      .then(({ failed, dataset, dimensions, measures }) => {
        // Если произошла ошибка при первичной загрузке датасета
        if (failed) {
          // Прекращаем обработку данных
          return;
        }

        widget.data.dataset = dataset;

        const datasetPath = dataset.key.replace(/[^/]+$/, '');

        dispatch(
          setDefaultPath({
            defaultPath: datasetPath,
          }),
        );

        receiveVisualization({
          visualization,
          fields: [...dimensions, ...measures],
          filters,
          colors,
          sort,
          coordType,
          titleLayerSource,
          clusterPrecision,
          nullAlias,
          needUniqueRows,
          needTotal,
          paginateInfo,
          labels,
          diagramMagnitude,
          mapLayerOpacity,
        });

        const searchPairs = decodeURI(location.search).match(/[^&?]+=[^&]+/g);
        const urlFilters = [];

        let fullFilters = filters;

        // Проставим фильтры
        if (searchPairs) {
          // Если есть фильтры, которые приходят через search параметры
          searchPairs.forEach(pair => {
            const splittedPair = pair.split('=');

            const key = splittedPair[0];
            let value = decodeURIComponent(splittedPair[1]);

            // Игнорируем пустые строки в значениях
            if (value === '') {
              return;
            }

            let code = 'IN';

            // Обработаем специальное значение "интервал"
            if (/^__interval_/.test(value)) {
              value = value.replace('__interval_', '').split('_');
              code = 'BETWEEN';
            } else {
              value = value.split(',');
            }

            // Попытаемся найти фильтруемое поле
            const foundItem = [...dimensions, ...measures].find(item =>
              item.guid === key ? item : null,
            );

            // Если такого нет в данных – игнорируем такой фильтр
            if (!foundItem) {
              return;
            }

            // Попытаемся найти такой фильтр среди созданных из search параметров
            const foundFilter = urlFilters.find(item => {
              return item.guid === key;
            });

            // Если такой фильтр нашелся, то новый не создаем, а дополняем старый
            if (foundFilter) {
              foundFilter.filter.value = [...foundFilter.filter.value, ...value];
            } else {
              urlFilters.push({
                ...foundItem,
                filter: {
                  operation: {
                    code,
                  },
                  value,
                },
              });
            }
          });

          urlFilters.forEach(filter => {
            const existingFilterIndex = filters.findIndex(existingFilter => {
              return existingFilter.guid === filter.guid;
            });

            if (existingFilterIndex !== -1) {
              filters.splice(existingFilterIndex, 1);
            }
          });

          fullFilters = [...filters, ...urlFilters];
        }

        // Проставляем датасет
        dispatch(receiveDataset({ dataset, measures, dimensions, updates }));

        // Обрабатываем проставление всех метаданных виджета
        dispatch(
          receiveWidget({
            data: widget,
          }),
        );

        // Проставляем фильтры
        dispatch(
          setFilters({
            filters: fullFilters,
          }),
        );

        // Проставляем разделения по цветам
        dispatch(setColors({ colors }));

        // Поддержка версий без сортировки
        if (!sort) {
          sort = [];
        }

        // Проставляем разделения по цветам
        dispatch(setSort({ sort }));

        // Проставляем тип координат
        dispatch(setCoordType({ coordType }));

        // Проставляем систему топосновы
        dispatch(setTitleLayerSource({ titleLayerSource }));

        // Проставляем точность кластера
        dispatch(setClusterPrecision({ clusterPrecision }));

        dispatch(setDiagramMagnitude({ diagramMagnitude }));

        dispatch(setMapLayerOpacity({ mapLayerOpacity }));

        dispatch(setNullAlias({ nullAlias }));

        dispatch(setNeedUniqueRows({ needUniqueRows }));

        // Проставляем флаг о строке итогов
        dispatch(setNeedTotal({ needTotal }));

        dispatch(setPaginateInfo({ paginateInfo }));

        //проставляем количесство выгружаемых строк
        dispatch(setExportLimit({ exportLimit }));

        // Проставляем подписи
        dispatch(setLabels({ labels }));

        if (!labels) {
          labels = [];
        }

        // Проставляем визуализацию и все ее параметры (какие поля выбраны)
        dispatch(setVisualization({ visualization }));

        // Рисуем график
        dispatch(
          updatePreview({
            dataset,
            dimensions,
            measures,
            visualization,
            filters: fullFilters,
            colors,
            sort,
            coordType,
            titleLayerSource,
            clusterPrecision,
            nullAlias,
            needUniqueRows,
            needTotal,
            paginateInfo,
            labels,
            updates,
            diagramMagnitude,
            mapLayerOpacity,
            exportLimit,
          }),
        );
      })
      .catch(error => {
        dispatch(receiveWidget({ error }));
      });
  };
}

export function toggleNavigation() {
  return {
    type: TOGGLE_NAVIGATION,
  };
}

export function toggleAccessRights() {
  return {
    type: TOGGLE_ACCESS_RIGHTS,
  };
}

export function toggleFullscreen() {
  return {
    type: TOGGLE_FULLSCREEN,
  };
}

export function setVisualizationType({ visualizationType }) {
  return {
    type: SET_VISUALIZATION_TYPE,
    visualizationType,
  };
}

export function setDefaultPath({ defaultPath }) {
  return {
    type: SET_DEFAULT_PATH,
    defaultPath,
  };
}

export function setDefaultsSet() {
  return {
    type: SET_DEFAULTS_SET,
  };
}

export function setVisualization({ visualization }) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_VISUALIZATION,
      visualization,
    });

    const state = getState();

    return {
      type: SET_VISUALIZATION,
      visualization,
      colors: state.visualization.colors,
      sort: state.visualization.sort,
      coordType: state.visualization.coordType,
      titleLayerSource: state.visualization.titleLayerSource,
      clusterPrecision: state.visualization.clusterPrecision,
      nullAlias: state.visualization.nullAlias,
      needUniqueRows: state.visualization.needUniqueRows,
      needTotal: state.visualization.needTotal,
      paginateInfo: state.visualization.paginateInfo,
    };
  };
}

export function clearVisualization() {
  return {
    type: CLEAR_VISUALIZATION,
  };
}

export function actualizeVisualization({ dataset, measures, dimensions }) {
  return {
    type: ACTUALIZE_VISUALIZATION,
    dataset,
    measures,
    dimensions,
  };
}

export function setVisualizationPlaceholderItems({ visualization, placeholder, items }) {
  return {
    type: SET_VISUALIZATION_PLACEHOLDER_ITEMS,
    visualization,
    placeholder,
    items,
  };
}

export function setFilters({ filters }) {
  return {
    type: SET_FILTERS,
    filters,
  };
}

export function setColors({ colors }) {
  return {
    type: SET_COLORS,
    colors,
  };
}

export function setSort({ sort }) {
  return {
    type: SET_SORT,
    sort,
  };
}

export function setCoordType({ coordType }) {
  return {
    type: SET_COORD_TYPE,
    coordType,
  };
}

export function setTitleLayerSource({ titleLayerSource }) {
  return {
    type: SET_TITLE_LAYER_SOURCE,
    titleLayerSource,
  };
}

export function setClusterPrecision({ clusterPrecision }) {
  return {
    type: SET_CLUSTER_PRECISION,
    clusterPrecision,
  };
}

export function setDiagramMagnitude({ diagramMagnitude }) {
  return {
    type: SET_DIAGRAM_MAGNITUDE,
    diagramMagnitude,
  };
}

export function setMapLayerOpacity({ mapLayerOpacity }) {
  return {
    type: SET_MAP_LAYER_OPACITY,
    mapLayerOpacity,
  };
}

export function setNullAlias({ nullAlias }) {
  return {
    type: SET_NULL_ALIAS,
    nullAlias,
  };
}

export function setNeedUniqueRows({ needUniqueRows }) {
  return {
    type: SET_NEED_UNIQUE_ROWS,
    needUniqueRows,
  };
}

export function setNeedTotal({ needTotal }) {
  return {
    type: SET_NEED_TOTAL,
    needTotal,
  };
}

export function setPaginateInfo({ paginateInfo }) {
  return {
    type: SET_PAGINATE_INFO,
    paginateInfo,
  };
}

export function setLabels({ labels }) {
  return {
    type: SET_LABELS,
    labels,
  };
}

export function applyTextFilter({ searchPhrase, measures, dimensions }) {
  if (searchPhrase) {
    return {
      type: APPLY_TEXT_FILTER,
      filteredDimensions: dimensions.filter(item => {
        return item.title.toLowerCase().indexOf(searchPhrase) !== -1;
      }),
      filteredMeasures: measures.filter(item => {
        return item.title.toLowerCase().indexOf(searchPhrase) !== -1;
      }),
    };
  } else {
    return {
      type: APPLY_TEXT_FILTER,
      filteredDimensions: null,
      filteredMeasures: null,
    };
  }
}

export function setSearchPhrase({ searchPhrase }) {
  return {
    type: SET_SEARCH_PHRASE,
    searchPhrase,
  };
}

export function setHighchartsWidget({ highchartsWidget }) {
  return {
    highchartsWidget,
    type: SET_HIGHCHARTS_WIDGET,
  };
}

export function setExportLimit({ exportLimit }) {
  return {
    exportLimit,
    type: SET_EXPORT_LIMIT,
  };
}

export function updatePreview(preview) {
  return {
    ...preview,
    type: UPDATE_PREVIEW,
  };
}

export function setDefaults({ preview, sdk, entryId }) {
  if (preview) {
    return function(dispatch) {
      entryId =
        entryId ||
        location.pathname
          .replace('/wizard', '')
          .replace('/preview', '')
          .slice(1);

      dispatch(
        updatePreview({
          previewEntryId: entryId,
        }),
      );

      dispatch(setDefaultsSet());
    };
  } else {
    return function(dispatch) {
      entryId = entryId || location.pathname.replace('/wizard', '').slice(1);

      if (entryId) {
        dispatch(
          fetchWidget({
            sdk,
            preview,
            entryId,
          }),
        );
      } else {
        const searchCurrentPath = location.search.match(/currentPath=([^&]+)/);
        dispatch(
          setDefaultPath({
            defaultPath: searchCurrentPath
              ? decodeURIComponent(searchCurrentPath[1])
              : window.DL.user.login
              ? `/Users/${window.DL.user.login}`
              : '/',
          }),
        );

        dispatch(setVisualization({ visualization: VISUALIZATIONS[3] }));
      }

      const searchPairs = location.search.match(/\w+=[^&]+/);
      if (searchPairs) {
        const parsedSearchPairs = searchPairs.map(pair => pair.split('='));
        const datasetIdPair = parsedSearchPairs.find(pair => pair[0] === '__datasetId');

        if (datasetIdPair) {
          const datasetId = datasetIdPair[1];

          dispatch(
            fetchDataset({
              datasetId,
              sdk,
            }),
          );
        }
      } else if (!entryId) {
        dispatch(toggleNavigation());
      }

      dispatch(setDefaultsSet());
    };
  }
}
