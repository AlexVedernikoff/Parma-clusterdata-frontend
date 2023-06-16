import moment from 'moment';
import lodashMin from 'lodash/min';

import ExtensionsManager, {
  EXTENSION_KEY,
} from '../../extensions-manager/extensions-manager';
import ErrorDispatcher, { ERROR_TYPE } from '../../error-dispatcher/error-dispatcher';

function prepareValue(value, firstValue, options) {
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

function sortByLastValue(a, b) {
  if (a._lastValue < b._lastValue) {
    return -1;
  }
  if (a._lastValue > b._lastValue) {
    return 1;
  }
  return 0;
}

function sortByAlphabet(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

const HIGHCHARTS_SCALE = {
  s: 'second',
  // i: 'minute', // т.к. минуты - это дефолтное значения для ChartWizard, которые многие не меняют
  h: 'hour',
  d: 'day',
  w: 'week',
  m: 'month',
  q: 'quarter',
  y: 'year',
};

function computeXTickScale(range) {
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

  for (const current in timeUnits) {
    if (timeUnits[current] > range) {
      return previous;
    }
    previous = current;
  }

  return previous;
}

// TODO: выходые для 'tot' можно проверять через moment
function removeHolidays(data, options) {
  const timeline = [];
  const graphsData = [];

  data.graphs.forEach((graph, i) => {
    graphsData[i] = [];
  });

  const HOLIDAYS = ExtensionsManager.get(EXTENSION_KEY.HOLIDAYS);

  data.categories_ms.forEach((ts, i) => {
    const datetime = moment(ts).format('YYYYMMDD');
    const region = (options.region && options.region.toLowerCase()) || 'tot';
    const holiday =
      HOLIDAYS.holiday[region][datetime] || HOLIDAYS.weekend[region][datetime];

    if (!holiday) {
      timeline.push(ts);
      data.graphs.forEach((graph, j) => graphsData[j].push(graph.data[i]));
    }
  });

  data.categories_ms = timeline;
  data.graphs.forEach((graph, i) => {
    graph.data = graphsData[i];
  });
}

// в data еще бывают comments
function prepareData(data, options) {
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
      // if (graph.title) {
      //     graph.title = graph.title.replace('<', '&lt;').replace('>', '&gt;');
      // }
      // graph.id = graph.id || graph.fname || graph.title || graph.name;
      graph.name = graph.name || graph.title;
    });

    let min = false;
    let max = false;
    let xmax;
    let xmin;

    // данные в милисекундах
    if (data.categories_ms) {
      // scale должно уйти и highcharts должен сам регулировать правильный формат для отображения лейблов
      // однако пока highcharts не справляется, если значение только одно, т.к. смотрит на closestPointRange
      options.highchartsScale = HIGHCHARTS_SCALE[options.scale];

      const closestPointRange = lodashMin(
        data.categories_ms.map(
          (timestamp, index) => timestamp - data.categories_ms[index - 1],
        ),
      );
      // TODO: у визарда по дефолту ставится минут
      // TODO: веротяно стоит унести вперед computeXTickScale или сравнивать со scale
      options.scale = options.scale || computeXTickScale(closestPointRange);

      if (options.scale && options.scale.length > 1) {
        // у скейлов вида 'w_by_d_sum' берем только первый символ, если он среди корректных
        const match = options.scale.match(/^[sihyqmwd]/g);
        options.scale = match ? match[0] : null;
      }

      const periodsCount = data.categories_ms.length || 0;
      xmin = data.categories_ms[0];
      xmax = data.categories_ms[periodsCount - 1];

      // у линий индикаторов вида type: 'sma' нет data
      data.graphs
        .filter(({ data }) => Boolean(data))
        .forEach((graph, index) => {
          let result = [];
          const aloneOrHasNull =
            graph.data.length === 1 || graph.data.indexOf(null) !== -1;

          const firstValue = graph.data[0];

          if (aloneOrHasNull) {
            result = graph.data.map((val, pos) => {
              // в качестве точек может быть массив чисел с объектами {x, y, color}
              if (val !== null && typeof val === 'object') {
                return val;
              }

              const preparedVal = prepareValue(val, firstValue, options);

              const currentPoint = {
                x: data.categories_ms[pos],
                y: preparedVal,
              };

              if (preparedVal !== null) {
                min = Math.min(min, preparedVal);
                max = Math.max(max, preparedVal);
              }

              return currentPoint;
            });
          } else {
            result = graph.data.map((val, pos) => {
              // в качестве точек может быть массив чисел с объектами {x, y, color}
              if (val !== null && typeof val === 'object') {
                return val;
              }
              const preparedVal = prepareValue(val, firstValue, options);
              min = Math.min(min, preparedVal);
              max = Math.max(max, preparedVal);
              return [data.categories_ms[pos], preparedVal];
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
      removeHolidays(data, options);
    }

    options.period = xmax - xmin;
    options.xmax = xmax; // используется в комментах и charts2_functions_view
    options.xmin = xmin; // аналогично
    options.max = max;
    options.min = min;
  }
}

export default prepareData;
