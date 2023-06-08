import moment from 'moment';
import lodashMin from 'lodash/min';
//LEGACY: зависимости старой фабрики виджитов
import ErrorDispatcher from '@kamatech-data-ui/chartkit/lib/modules/error-dispatcher/error-dispatcher';
//LEGACY: зависимости старой фабрики виджитов
import ExtensionsManager from '@kamatech-data-ui/chartkit/lib/modules/extensions-manager/extensions-manager';

const ERROR_TYPE = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',

  UNKNOWN_EXTENSION: 'UNKNOWN_EXTENSION',
  UNSUPPORTED_EXTENSION: 'UNSUPPORTED_EXTENSION',

  CONFIG_LOADING_ERROR: 'CONFIG_LOADING_ERROR',
  EXECUTION_ERROR: 'EXECUTION_ERROR',
  DATA_FETCHING_ERROR: 'DATA_FETCHING_ERROR',
  WIZARD_DATA_FETCHING_ERROR: 'wizard_data_fetching_error',

  NO_DATA: 'NO_DATA',
  TOO_MANY_LINES: 'TOO_MANY_LINES',

  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  RENDER_ERROR: 'RENDER_ERROR',

  INCLUDES_LOADING_ERROR: 'INCLUDES_LOADING_ERROR',

  EXCEEDED_DATA_LIMIT: 'EXCEEDED_DATA_LIMIT',
};

const HIGHCHARTS_SCALE = {
  s: 'second',
  h: 'hour',
  d: 'day',
  w: 'week',
  m: 'month',
  q: 'quarter',
  y: 'year',
};

const EXTENSION_KEY = {
  HOLIDAYS: 'holidays',
};

function prepareValue(value: number, firstValue: number, options: any): number | null {
  if (value === null) {
    return null;
  }
  if (options.normalizeDiv) {
    return value / (firstValue || 1);
  }
  if (options.normalizeSub) {
    return value - firstValue;
  }
  return value;
}

function sortByLastValue(a: any, b: any): number {
  if (a.lastValue < b.lastValue) {
    return -1;
  }
  if (a.lastValue > b.lastValue) {
    return 1;
  }
  return 0;
}

function sortByAlphabet<T extends { name: string }>(a: T, b: T): number {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

function computeXTickScale(range: number): string {
  const timeUnits = {
    s: 1000,
    i: 60000,
    h: 3600000,
    d: 86400000,
    w: 604800000,
    m: 2419200000,
    q: 7344000000,
    y: 31449600000,
  };
  let previous = 's';

  let current: keyof typeof timeUnits;
  for (current in timeUnits) {
    if (timeUnits[current] > range) {
      return previous;
    }
    previous = current;
  }

  return previous;
}

function removeHolidays<
  D,
  L extends { data: any },
  T extends { graphs: L[]; categories_ms: string[] },
  K extends { region: string }
>(data: T, options: K): void {
  const timeline: string[] = [];
  const graphsData: D[] | never[] | any = [];

  data.graphs.forEach((_, i: number) => {
    graphsData[i] = [];
  });

  const HOLIDAYS = ExtensionsManager.get(EXTENSION_KEY.HOLIDAYS);

  data.categories_ms.forEach((ts: string, i: number) => {
    const datetime = moment(ts).format('YYYYMMDD');
    const region = (options.region && options.region.toLowerCase()) || 'tot';
    const holiday =
      HOLIDAYS.holiday[region][datetime] || HOLIDAYS.weekend[region][datetime];

    if (!holiday) {
      timeline.push(ts);
      data.graphs.forEach((graph, j: number) => graphsData[j].push(graph.data[i]));
    }
  });

  data.categories_ms = timeline;
  data.graphs.forEach((graph, i) => {
    graph.data = graphsData[i];
  });
}

interface IPrepareData {
  graphs: {
    name: string;
    title: string;
    data: any;
    _lastValue: string;
  }[];
  categories?: {
    [key: number]: string;
  }[];
  categories_ms?: number[];
}

interface IPrepareDataOptions {
  max: boolean;
  min: boolean;
  xmax: string;
  xmin: string;
  withoutLineLimit: boolean;
  scale: string | null;
  highchartsScale: string;
  orderType: string;
  orderSort: string;
  period: number;
  hideHolidays: boolean;
}

export const prepareData = (data: IPrepareData, options: IPrepareDataOptions): void => {
  if (
    !data ||
    (typeof data === 'object' && !Object.keys(data).length) ||
    (data.graphs &&
      !(
        data.graphs.length && data.graphs.some(graph => graph.data && graph.data.length)
      )) ||
    (Array.isArray(data) && !data.length)
  ) {
    throw ErrorDispatcher.wrap({ type: ERROR_TYPE.NO_DATA });
  }

  if (data.graphs) {
    if (data.graphs.length > 50 && !options.withoutLineLimit) {
      throw ErrorDispatcher.wrap({ type: ERROR_TYPE.TOO_MANY_LINES });
    }

    data.graphs.forEach(graph => {
      graph.name = graph.name || graph.title;
    });

    let min: any = false;
    let max: any = false;
    let xmax;
    let xmin;

    // данные в милисекундах
    if (data.categories_ms) {
      options.highchartsScale =
        HIGHCHARTS_SCALE[options.scale as keyof typeof HIGHCHARTS_SCALE];

      const closestPointRange = lodashMin(
        data.categories_ms.map(
          (timestamp: number, index: number) =>
            timestamp -
            ((data && data.categories_ms && data.categories_ms[index - 1]) ?? 0),
        ),
      ) as number;
      options.scale = options.scale || computeXTickScale(closestPointRange);

      if (options.scale && options.scale.length > 1) {
        const match = options.scale.match(/^[sihyqmwd]/g);
        options.scale = match ? match[0] : null;
      }

      const periodsCount = data.categories_ms.length || 0;
      xmin = data.categories_ms[0];
      xmax = data.categories_ms[periodsCount - 1];

      // у линий индикаторов вида type: 'sma' нет data
      data.graphs
        .filter(({ data }) => Boolean(data))
        .forEach((graph, index: number) => {
          let result = [];
          const aloneOrHasNull =
            graph.data.length === 1 || graph.data.indexOf(null) !== -1;

          const firstValue = graph.data[0];

          if (aloneOrHasNull) {
            result = graph.data.map((val: any, pos: number) => {
              // в качестве точек может быть массив чисел с объектами {x, y, color}
              if (val !== null && typeof val === 'object') {
                return val;
              }

              const preparedVal = prepareValue(val, firstValue, options);

              const currentPoint = {
                x: data.categories_ms && data.categories_ms[pos],
                y: preparedVal,
              };

              if (preparedVal !== null) {
                min = Math.min(min, preparedVal);
                max = Math.max(max, preparedVal);
              }

              return currentPoint;
            });
          } else {
            result = graph.data.map((val: any, pos: number) => {
              // в качестве точек может быть массив чисел с объектами {x, y, color}
              if (val !== null && typeof val === 'object') {
                return val;
              }
              const preparedVal = prepareValue(val, firstValue, options);
              min = Math.min(min, preparedVal as any);
              max = Math.max(max, preparedVal as any);
              return data.categories_ms && [data.categories_ms[pos], preparedVal];
            });
          }

          data.graphs[index].data = result;
        });

      delete data.categories;
    }

    // данные в категориях
    if (data.categories) {
      const periodsCount = data.categories.length || 0;
      xmin = data.categories[0];
      xmax = data.categories[periodsCount - 1];

      delete data.categories_ms;
    }

    if (options.orderType === 'byLastValue') {
      data.graphs.forEach(graphItem => {
        graphItem._lastValue =
          (graphItem.data &&
            graphItem.data[graphItem.data.length - 1] &&
            (graphItem.data[graphItem.data.length - 1][1] ||
              graphItem.data[graphItem.data.length - 1].y)) ||
          0;
      });
      data.graphs.sort(sortByLastValue);
    }

    if (options.orderType === 'alphabet') {
      data.graphs.sort(sortByAlphabet);
    }

    if (
      (options.orderType === 'byLastValue' || options.orderType === 'alphabet') &&
      options.orderSort === 'fromBottom'
    ) {
      data.graphs.reverse();
    }

    if (options.hideHolidays && ExtensionsManager.has(EXTENSION_KEY.HOLIDAYS)) {
      removeHolidays(data as any, options as any);
    }

    //@ts-ignore
    options.period = xmax - xmin;
    //@ts-ignore
    options.xmax = xmax; // используется в комментах и charts2_functions_view
    //@ts-ignore
    options.xmin = xmin; // аналогично
    options.max = max;
    options.min = min;
  }
};
