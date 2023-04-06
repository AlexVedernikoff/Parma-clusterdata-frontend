import Highcharts from 'highcharts';
import merge from 'lodash/merge';

import defaultOptions from './options';
import formatTooltip from './tooltip/tooltip';
import { buildLegend } from '../graph/config/config';

function formatNumber(number, { format }) {
  const multiplier = format && format.percent ? 100 : 1;
  const suffix = multiplier > 1 ? ' %' : '';
  const precision = format && format.precision ? format.precision : 0;
  return Highcharts.numberFormat(number * multiplier, precision, ',', ' ') + suffix;
}

// TODO: проверить не дублирует ли функционал dateTimeLabels HC
function getDateTimeLabelFormats(scale) {
  let minTickInterval;
  let strftime = '';

  switch (scale) {
    case 'd':
      minTickInterval = 3600 * 24 * 1000;
      strftime = '%d %B %Y';
      break;
    case 'w':
      minTickInterval = 3600 * 24 * 7 * 1000;
      strftime = '%d %B %Y';
      break;
    case 'm':
      minTickInterval = 3600 * 24 * 27 * 1000;
      strftime = '%B %Y';
      break;
    case 'i':
      minTickInterval = 60 * 1000;
      strftime = '%d %B %Y %H:%M';
      break;
    case 's':
      minTickInterval = 1000;
      strftime = '%d %B %Y %H:%M:%S';
      break;
    case 'h':
      minTickInterval = 3600 * 1000;
      strftime = '%d %B %Y %H:%M';
      break;
    case 'q':
      minTickInterval = 3600 * 24 * 85 * 1000;
      strftime = "%Q'%Y";
      break;
    case 'y':
      minTickInterval = 3600 * 24 * 27 * 1000;
      strftime = '%Y';
      break;
  }

  return {
    mintickinterval: minTickInterval,
    strftime: strftime,
  };
}

function getMap(options, data) {
  data = Array.isArray(data) ? data : data.map;

  options.scale = options.scale || 'd';
  options.type = 'map';

  const scale = getDateTimeLabelFormats(options.scale);

  // options.legendPosition = (settings.martOverride && settings.martOverride.legendPosition) || settings.legendPosition || settings.legend;

  const params = merge({}, defaultOptions, {
    series: data,
    tooltip: {
      formatter: function() {
        if (this.point) {
          if (!this.point.name_local) {
            this.point.name_local = this.point.properties.name_ru;
          }

          this.point.header = this.point.datetime
            ? Highcharts.dateFormat(scale.strftime, new Date(Number(this.point.datetime)))
            : this.point.name_local;

          if (!this.point.tooltipValues) {
            this.point.tooltipValues = [
              {
                value: this.point.value,
                title: this.series.name,
              },
            ];
          }

          if (typeof options.manageTooltipConfig === 'function') {
            Object.assign(this.point, options.manageTooltipConfig(this.point));
          }

          this.point.tooltipValues.forEach((point, index) => {
            point.colorBubble = index === 0;
            point.formatted = point.formatted || formatNumber(point.value, options);
          });

          return formatTooltip(this.point);
        }
      },
    },
    title: {
      text: options.title,
    },
    subtitle: {
      text: options.subtitle,
    },
    legend: {
      ...buildLegend(options),
    },
    plotOptions: {
      map: {
        dataLabels: {
          enabled: options.displayLabels,
          formatter: function() {
            return formatNumber(this.point.value, options);
          },
        },
      },
    },
    colorAxis: {
      labels: {},
    },
  });

  if (options.format) {
    params.colorAxis.labels.formatter = function() {
      return formatNumber(this.value, options);
    };
  }

  if (Array.isArray(data) && data[0]) {
    if (params.title.text === undefined) {
      params.title.text = data[0].title;
    }

    if (data[0].datetime) {
      const datetime = Highcharts.dateFormat(scale.strftime, new Date(Number(data[0].datetime)));
      if (!params.title.text) {
        params.title.text = datetime;
      } else if (!params.subtitle.text) {
        params.subtitle.text = datetime;
      }
    }
  }

  params.series.forEach(serie => {
    // для совместимости с картами
    // элементы массива удаляются через delete, и на их месте появляется undefined
    serie.data = serie.data.filter(Boolean);
  });

  // TODO: почему some?
  params.series.some(series =>
    series.data.some(point => {
      if (point.value === 0) {
        point.value = 0.001;
        params.colorAxis.min = Math.min(1, params.colorAxis.min || 1);
      }
      if (point.value < 0) {
        params.colorAxis.type = 'linear';
        return true;
      }
      return false;
    }),
  );

  // if (settings.martOverride && settings.martOverride.outsideLegend) {
  //     settings.legendPosition = null;
  // }

  // Переопределяем заголовок для витрины
  // options = chartTools.applyMartTitleOptions(options, settings.martOverride);

  // Переопределяем легенду для витрины
  // if (settings.martOverride) {
  //     settings = chartTools.applyMartLegendOptions(settings, settings.martOverride);
  // }

  // options = chartTools.buildLegendOverride(options, settings, 'map');

  merge(params, options.highcharts);

  return {
    config: params,
    callback: chart => {},
  };
}

export default getMap;
