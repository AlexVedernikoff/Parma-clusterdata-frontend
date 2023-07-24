import axios from 'axios';

import axiosInstance from '../axios/axios';
import settings from '../settings/settings';
import ErrorDispatcher, { ERROR_TYPE } from '../error-dispatcher/error-dispatcher';

import { URL_OPTIONS } from '../constants/constants';
// TODO: изменить импорт на `@clustrum-lib`
import { WidgetType } from '@clustrum-lib/shared/ui/widgets-factory/widget-type';

import runNode from './engines/node';
import runWizard from './engines/wizard';

function isWizard(type) {
  return /_wizard$/.test(type);
}

function printApiRunLogs(logs) {
  if (!logs) {
    return;
  }

  const engineLogs = JSON.parse(logs, (key, value) => {
    if (value === '__ee_special_value__NaN') {
      return NaN;
    }
    if (value === '__ee_special_value__Infinity') {
      return Infinity;
    }
    if (value === '__ee_special_value__-Infinity') {
      return -Infinity;
    }

    return value;
  });

  Object.keys(engineLogs).forEach(logType => {
    const typedLogs = engineLogs[logType];
    if (typedLogs.length) {
      console.group(logType);
      typedLogs.forEach(log => {
        const logValues = log.map(logItem => logItem.value);
        console.log(...logValues);
      });
      console.groupEnd();
    }
  });
}

function graphToTable(data, config) {
  const head = [];
  const rows = [];
  let categories = '';

  if (data.categories_ms) {
    head.push({
      id: 'categories_ms',
      name: 'Дата',
      type: 'date',
      scale: config.scale,
    });
    categories = 'categories_ms';
  } else if (data.categories) {
    head.push({
      id: 'categories',
      name: 'Категории',
      type: 'string',
    });
    categories = 'categories';
  }

  data.graphs.forEach(graph =>
    head.push({
      id: graph.id || graph.title || graph.name,
      name: graph.title || graph.name,
      type: 'number',
      precision: config.precision,
    }),
  );

  data[categories].forEach((category, index) => {
    const cells = [{ value: category }];
    data.graphs.forEach(graph => cells.push({ value: graph.data[index] }));
    rows.push({ cells: cells });
  });

  return {
    config: {
      sort: head[0].id,
      order: 'desc',
    },
    data: {
      head: head,
      rows: rows,
    },
  };
}

function postRun(loaded) {
  const { config, params, data, widgetType } = loaded;

  const denormalizedParams = Object.keys(params).reduce((result, key) => {
    const value = params[key];
    result[key] = Array.isArray(value) && value.length ? value[0] : value;
    return result;
  }, {});

  /* eslint-disable eqeqeq */
  const newConfig = {
    hideComments: denormalizedParams[URL_OPTIONS.HIDE_COMMENTS] == '1',
    hideHolidays: denormalizedParams[URL_OPTIONS.HIDE_HOLIDAYS] == '1',
    normalizeDiv: denormalizedParams[URL_OPTIONS.NORMALIZE_DIV] == '1',
    normalizeSub: denormalizedParams[URL_OPTIONS.NORMALIZE_SUB] == '1',
  };
  /* eslint-enable eqeqeq */

  const withoutLineLimit = denormalizedParams[URL_OPTIONS.WITHOUT_LINE_LIMIT];
  if (withoutLineLimit !== undefined) {
    newConfig.withoutLineLimit = Boolean(withoutLineLimit);
  }

  const title = denormalizedParams['_graph_title'];
  if (title) {
    newConfig.title = title;
  }

  const subtitle = denormalizedParams['_graph_subtitle'];
  if (subtitle) {
    newConfig.subtitle = subtitle;
  }

  const converted = { config: {} };
  const editorType = denormalizedParams['_editor_type'];
  if (editorType) {
    if (widgetType === WidgetType.Graph && editorType === WidgetType.Table) {
      converted.widgetType = WidgetType.Table;
      const { data: convertedData, config: convertedConfig } = graphToTable(data, config);
      converted.data = convertedData;
      converted.config = convertedConfig;
    }
  }

  if (denormalizedParams['_highstock_start'] || denormalizedParams['_highstock_end']) {
    newConfig.highstock = {
      override_range_min: parseInt(denormalizedParams['_highstock_start'], 10),
      override_range_max: parseInt(denormalizedParams['_highstock_end'], 10),
    };
  }

  return {
    ...loaded,
    ...converted,
    config: {
      ...config,
      ...converted.config,
      ...newConfig,
    },
  };
}

class Charts {
  static async load({
    id,
    source,
    params,
    editMode: { config, type } = {},
    paginateInfo,
    headers,
    cancelToken,
    orderBy,
  }) {
    const isEditMode = config && type;
    try {
      const { data } = await axiosInstance(
        settings.requestDecorator({
          url: `${settings.chartsEndpoint}/run`,
          method: 'post',
          data: {
            id,
            path: source,
            params,
            config: config
              ? {
                  data: {
                    shared: this.lightWeightWidgetDataConfig(config.shared),
                  },
                  meta: { stype: type },
                }
              : null,
            responseOptions: {
              includeConfig: true,
            },
            pageSize: paginateInfo ? paginateInfo.pageSize : null,
            page: paginateInfo ? paginateInfo.page : null,
            enableCaching: window.DL.enableCaching ? window.DL.enableCaching : false,
            cacheMode: window.DL.cacheMode ? window.DL.cacheMode : null,
            orderBy:
              orderBy && orderBy.direction
                ? [
                    {
                      direction: orderBy.direction,
                      field: orderBy.field,
                    },
                  ]
                : null,
          },
          headers,
          cancelToken,
        }),
      );

      if (isEditMode && data) {
        printApiRunLogs(data.logs_v2);
      }

      return data;
    } catch (error) {
      if (axios.isCancel(error)) {
        return null;
      }

      if (!error.response) {
        throw ErrorDispatcher.wrap({ type: ERROR_TYPE.NETWORK_ERROR, error });
      }

      const { response: { status, data: extra } = {} } = error;

      if (isEditMode && extra) {
        printApiRunLogs(extra.logs_v2);
      }

      if (status === 489) {
        throw ErrorDispatcher.wrap({
          type: ERROR_TYPE.AUTHORIZATION_ERROR,
          error,
          extra,
        });
      }

      if (extra.errorType) {
        const { errorType, ...rest } = extra;
        throw ErrorDispatcher.wrap({ type: errorType, error, extra: rest });
      }

      throw ErrorDispatcher.wrap({ type: ERROR_TYPE.EXECUTION_ERROR, error, extra });
    }
  }

  static async getData({
    id,
    source,
    params,
    editMode,
    paginateInfo,
    headers,
    cancelToken,
    orderBy,
  }) {
    const loaded = await Charts.load({
      id,
      source,
      params,
      editMode,
      paginateInfo,
      headers,
      cancelToken,
      orderBy,
    });

    if (loaded) {
      if (loaded.NO_DATA_AVAILABLE_HERE) {
        throw ErrorDispatcher.wrap({ type: ERROR_TYPE.UNSUPPORTED_EXTENSION });
      }

      const { _confStorageConfig: { type } = {} } = loaded;

      const runned = isWizard(type) ? runWizard(loaded) : runNode(loaded);

      return postRun(runned);
    }

    return null;
  }

  static lightWeightWidgetDataConfig(config) {
    let lightWeightConfig = JSON.parse(JSON.stringify(config));

    lightWeightConfig.dimensions = [];
    lightWeightConfig.measures = [];

    return lightWeightConfig;
  }
}

export default Charts;
