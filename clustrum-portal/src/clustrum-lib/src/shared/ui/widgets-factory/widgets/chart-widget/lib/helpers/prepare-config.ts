import moment from 'moment';
import merge from 'lodash/merge';
import mergeWith from 'lodash/mergeWith';
import { drawComments, hideComments, drawOnlyRendererComments } from './drawing';
import defaultOptions from './get-default-options';
// TODO: убрать зависимость старой фабрики виджетов после переписывания этого скрипта
// eslint-disable-next-line
// @ts-ignore
import ExtensionsManager from '@kamatech-data-ui/chartkit/lib/modules/extensions-manager/extensions-manager';
import { $appSettingsStore } from '@entities/app-settings';

const EXTENSION_KEY = {
  HOLIDAYS: 'holidays',
};

const COUNT_ROWS_FOR_FORCE_HIDE = 4;

const LEGEND_MANAGE_SERIE = 'legend_manage_serie';

const CUSTOM_TYPES = {
  stack: {
    type: 'area',
    stacking: 'normal',
  },
  stacked_100p: {
    type: 'area',
    stacking: 'percent',
  },
  stacked_column: {
    type: 'column',
    stacking: 'normal',
  },
  stacked_column_100p: {
    type: 'column',
    stacking: 'percent',
  },
};

function buildNavigator(graphs: any, options: any): void {
  const baseSeriesName = options.highstock.base_series_name || '';
  let showInNavigator: any;

  graphs.forEach((item: any) => {
    if (typeof item.showInNavigator === 'undefined') {
      item.showInNavigator =
        item.sname === baseSeriesName ||
        item.name === baseSeriesName ||
        item.title === baseSeriesName;
    }

    if (!showInNavigator) {
      showInNavigator = item.showInNavigator;
    }
  });

  // set 0 graph for navigator if there is not set another
  if (!showInNavigator) {
    if (graphs.length) {
      graphs[0].showInNavigator = true;
    }
  }
}

function redrawDataLabelsInColumnChart(chart: any): void {
  // Применяем, только если больше одного столбца в группе
  chart.series.length > 1 &&
    chart.series.forEach(function(series: any, seriesIndex: number) {
      series.points.forEach(function(point: any) {
        if ((point.index + seriesIndex) % 2 === 0) {
          point.dataLabel &&
            point.dataLabel.translate(point.dataLabel.x, point.dataLabel.y - 10);
        }
      });
    });
}

function isManageSerie(serie: any): boolean {
  // TODO: брать из константы
  return serie.name === LEGEND_MANAGE_SERIE;
}

function buildLegend(options: any): any {
  const legend: any = {
    alignColumns: false,
    labelFormatter: function(): any {
      if (isManageSerie(this)) {
        return `<span style="color: gray;">Скрыть все линии</span>`;
      } else {
        return this.name;
      }
    },
  };

  if (options.outsideLegend) {
    options.legendPosition = null;
  }

  if (options.legendResetMargin || options.outsideLegend) {
    legend.y = 0;
    legend.x = 0;
  }

  // проверяем, нужна ли плавающая легенда, position - цифра на часовом циферблате
  if (
    typeof options.legendPosition === 'number' &&
    options.legendPosition >= 1 &&
    options.legendPosition <= 12
  ) {
    if (options.type !== 'map') {
      legend.layout = 'vertical';
    }

    legend.verticalAlign = 'middle';
    legend.backgroundColor = 'rgba(255,255,255,0.9)';
    legend.floating = true;

    switch (options.legendPosition) {
      case 1:
      case 2:
        legend.verticalAlign = 'top';
        legend.align = 'right';
        break;
      case 3:
        legend.verticalAlign = 'middle';
        legend.align = 'right';
        break;
      case 4:
      case 5:
        legend.verticalAlign = 'bottom';
        legend.align = 'right';
        break;
      case 6:
        legend.verticalAlign = 'bottom';
        legend.align = 'center';
        break;
      case 7:
      case 8:
        legend.verticalAlign = 'bottom';
        legend.align = 'left';
        break;
      case 9:
        legend.verticalAlign = 'middle';
        legend.align = 'left';
        break;
      case 10:
      case 11:
        legend.verticalAlign = 'top';
        legend.align = 'left';
        break;
      case 12:
        legend.verticalAlign = 'top';
        legend.align = 'center';
        break;
    }

    if (options.legendPosition >= 4 && options.legendPosition <= 8) {
      if (options.highstock) {
        legend.margin = -38;
        legend.y -= 110;
      } else {
        legend.y -= 50;
      }
    }

    // w100@: для "левых" значений делаем отступ, чтобы не затирать значения оси
    if (options.legendPosition >= 7 && options.legendPosition <= 11) {
      legend.x = 45;
    }

    if (options.legendPosition === 4 || options.legendPosition === 8) {
      legend.y += -45;
    }
  }

  return legend;
}

function hasChartVisibleSeries(chart: any): boolean {
  return (
    chart &&
    Array.isArray(chart.series) &&
    chart.series.some((serie: any) => !isManageSerie(serie) && serie.visible)
  );
}

function hasChartManageSerie(chart: any): boolean {
  return (
    chart &&
    Array.isArray(chart.series) &&
    chart.series.some((serie: any) => isManageSerie(serie))
  );
}

function getParamsByCustomType(type = 'line', options: any): any {
  //@ts-ignore
  const customType = CUSTOM_TYPES[type];
  return customType
    ? {
        chart: {
          type: customType.type,
        },
        plotOptions: {
          [customType.type]: {
            stacking: customType.stacking,
            enableSum:
              options.enableSum === undefined || options.enableSum === null
                ? true
                : options.enableSum,
          },
        },
      }
    : {
        chart: {
          type,
        },
      };
}

function legendShowHide(serie: any, type: string, vaultId: number): void {
  if (serie.options.className === 'highcharts-navigator-series') {
    // TODO: в случае навигатора если скрыть линию, которая есть внутри highstock и перерисовать график,
    // TODO: то на графике линии не будет, но в highstock будет
    // линия внутри highstock
    return;
  }
  if (isManageSerie(serie)) {
    const visible = hasChartVisibleSeries(serie.chart);

    serie.chart.series.forEach((item: any) => {
      if (!isManageSerie(item)) {
        if (visible) {
          serie.chart.series[item.index].hide();
        } else {
          serie.chart.series[item.index].show();
        }
      }
    });
  }

  manageLegend(serie.chart);

  hideComments(
    serie.chart,
    serie.chart.userOptions._comments,
    serie.chart.userOptions._config,
    null,
  );
  drawComments(
    serie.chart,
    serie.chart.userOptions._comments,
    serie.chart.userOptions._config,
    null,
  );
}

function manageLegend(chart: any): void {
  if (chart && hasChartManageSerie(chart)) {
    const text = hasChartVisibleSeries(chart) ? 'Скрыть все линии' : 'Показать все линии';

    const firstLegendItem = chart.container.querySelector('.highcharts-legend-item');
    if (firstLegendItem) {
      firstLegendItem.querySelector('tspan').textContent = text;
      firstLegendItem.setAttribute('transform', 'translate(-13,3)');
      const pathElem = firstLegendItem.querySelector('path');
      if (pathElem) {
        pathElem.parentNode.removeChild(pathElem);
      }
    }
  }
}

function findXVal(xAxisVal: number, categoriesMs: any): number | undefined {
  let xVal, min, max, leftDiff, rightDiff;

  categoriesMs.forEach(function(val: number, pos: number) {
    if (pos > 0) {
      max = val - xAxisVal;
      min = xAxisVal - categoriesMs[pos - 1];

      if (
        (pos == 1 && xAxisVal < categoriesMs[pos]) ||
        (categoriesMs[pos - 1] <= xAxisVal && categoriesMs[pos] > xAxisVal) ||
        (pos == categoriesMs.length - 1 && xAxisVal > categoriesMs[pos])
      ) {
        max = categoriesMs[pos];
        min = categoriesMs[pos - 1];

        leftDiff = xAxisVal - min;
        rightDiff = max - xAxisVal;

        if (leftDiff >= rightDiff) {
          xVal = max;
        } else {
          xVal = min;
        }
      }
    }
  });

  return xVal;
}

function tooltipDiffClick(xVal: number | undefined, chart: any, options: any): void {
  if (!xVal) {
    return;
  }

  function unCheck(): void | boolean {
    if (!options.useCompareFrom) {
      return false;
    }

    chart.xAxis[0].removePlotLine(options.useCompareFrom);
    options.useCompareFrom = undefined;
  }

  function check(): void {
    unCheck();

    const lineConfig = {
      value: xVal,
      width: 1,
      color: '#000000',
      id: xVal,
      zIndex: 20,
    };

    chart.xAxis[0].addPlotLine(lineConfig);
    options.useCompareFrom = xVal;
  }

  if (xVal && xVal !== options.useCompareFrom) {
    check();
  } else {
    unCheck();
  }
}

interface IPrepareHolidaysReturnType {
  className?: string;
  from: number;
  to: number;
}

function prepareHolidays(data: any, options: any): IPrepareHolidaysReturnType[] {
  const bands: IPrepareHolidaysReturnType[] = [];
  const region = (options.region || 'TOT').toLowerCase();
  const HALF_DAY = 43200000;

  const HOLIDAYS = ExtensionsManager.get(EXTENSION_KEY.HOLIDAYS);

  data.categories_ms.forEach((item: number) => {
    const pointTimestamp = moment(item).format('%Y%m%d');
    const holidayByRegion = HOLIDAYS.holiday[region];
    const weekendByRegion = HOLIDAYS.weekend[region];

    if (
      (holidayByRegion && holidayByRegion[pointTimestamp]) ||
      (weekendByRegion && weekendByRegion[pointTimestamp])
    ) {
      const bandStart = item - HALF_DAY;
      const bandStop = item + HALF_DAY;

      if (bands.length && bandStart === bands[bands.length - 1].to) {
        bands[bands.length - 1].to = bandStop;
      } else {
        bands.push({ from: bandStart, to: bandStop });
      }
    }
  });

  return bands.map(key => {
    return {
      className: 'chartkit-graph__holiday-band',
      from: key.from,
      to: key.to,
    };
  });
}

function prepareZones(options: any): any {
  const plotbands = [];
  const zonesColors = ['#FFD3C9', '#FFFFC9', '#C9FFCA', '#C4C6D4', '#D4C4D2'];

  for (let i = 0; i < options.zones.length; i++) {
    let nowColor = options.zones[i].color;
    if (!nowColor.length) {
      nowColor = zonesColors[i];
    }

    let nowFrom = options.zones[i].from;
    if (nowFrom === 'min') {
      nowFrom = -Infinity;
    }

    let nowTo = options.zones[i].to;
    if (nowTo === 'max') {
      nowTo = Infinity;
    }

    const nowzone = {
      color: nowColor,
      from: nowFrom,
      to: nowTo,
      label: {
        text: options.zones[i].text,
        textAlign: 'left',
        style: {
          color: '#3E576F',
          'font-size': '8pt',
        },
      },
    };

    plotbands.push(nowzone);
  }

  return plotbands;
}

function getTypeParams(data: any, options: any): any {
  // Начиная с версии 1.3.5 нужно немного тюнить положение подписей
  const params: any = { xAxis: { labels: { y: 15 } } };
  const period: any = options.period;

  if (data.categories_ms) {
    params.xAxis.type = 'datetime';
    params.xAxis.labels.staggerLines = 1;
  } else {
    const flag = options.type === 'line' || options.type === 'area';
    params.xAxis.startOnTick = flag;
    params.xAxis.endOnTick = flag;

    if (data.categories) {
      params.xAxis.categories = data.categories;
    }
  }

  if (options.highstock) {
    params.xAxis.events = {};
    params.xAxis.events.setExtremes = (e: any): void => {
      const chart = e.target.chart;
      if (chart.userOptions.isLoaded) {
        hideComments(chart, chart.userOptions._comments, chart.userOptions._config, null);
        drawComments(chart, chart.userOptions._comments, chart.userOptions._config, null);
      }
    };
  }

  if (options.echart && options.echart.yAxis && options.echart.yAxis.length) {
    params.yAxis = options.echart.yAxis;
  } else {
    params.yAxis = {
      plotLines: [
        {
          value: 0,
          width: 1,
        },
      ],
      labels: {},
    };

    // logarithmic, yAxis_max, yAxis_min - из отчетов статфейса
    if (options.logarithmic === 'true' || options.logarithmic === true) {
      params.yAxis.type = 'logarithmic';
      params.yAxis.minorTickInterval = 'auto';
    }

    if (options.yAxis_max) {
      params.yAxis.max = options.yAxis_max;
    }

    if (options.yAxis_min) {
      params.yAxis.min = options.yAxis_min;
    } else if (options.min > 0 && options.max / options.min > 8) {
      // 8 is a strange empirically obtained constant
      params.yAxis.floor = 0;
    }
  }

  // показываем выходные только для дневного скейла и для периода > 3 суток
  if (
    options.scale === 'd' &&
    !options.hideHolidaysBands &&
    data.categories_ms &&
    period > 259200000 &&
    ExtensionsManager.has(EXTENSION_KEY.HOLIDAYS)
  ) {
    params.xAxis.plotBands = prepareHolidays(data, options);
  }

  if (options.zones) {
    params.yAxis.plotBands = prepareZones(options);
  }

  return params;
}

export const prepareConfig = (data: any, options: any, vaultId: number): any => {
  const params = merge(getParamsByCustomType(options.type, options), defaultOptions, {
    _config: options,
    chart: {
      events: {
        load: function() {
          manageLegend(this);
          this.userOptions.isLoaded = true;
        },
        click: options.showTooltipDiff
          ? function(event: any): void {
              const xVal = findXVal(event.xAxis[0].value, data.categories_ms);
              //@ts-ignore
              tooltipDiffClick(xVal, this, options);
            }
          : undefined,
        redraw: function() {
          drawOnlyRendererComments(
            this,
            this.userOptions._comments,
            this.userOptions._config,
          );
          manageLegend(this);

          options.echart.chart.type === 'column' && redrawDataLabelsInColumnChart(this);
        },
      } as any,
      spacingTop: 20,
    },
    title: {
      text: options.hideTitle ? null : options.title,
      floating: options.titleFloating,
    },
    subtitle: {
      text: options.hideTitle ? null : options.subtitle,
    },
    series: data.graphs || data,
    legend:
      options.hideLegend === true || options.showLegend === false
        ? { enabled: false }
        : buildLegend(options),
    tooltip: {
      style: {
        width: 'auto',
      },
      // поле shared для tooltip можно проставить только в одном месте (на первом уровне)
      // при sankey тип shared нужно выставлять в false, иначе тултип ведет себя некорректно:
      // * если наведено на пустую область, то показывается тултип какого-либо из полей
      // * Point.onMouseOver -> Highcharts.Pointer.runPointActions -> H.Tooltip.refresh -> Cannot read property 'series' of undefined
      shared:
        !options.echart ||
        !options.echart.chart ||
        options.echart.chart.type !== 'sankey',
    },
    plotOptions: {
      series: {
        events: {
          show: function() {
            legendShowHide(this, 'show', vaultId);
          },
          hide: function() {
            legendShowHide(this, 'hide', vaultId);
          },
          mouseOver: function() {
            this.chart.userOptions._activeSeries = this.index;
          },
        } as any,
        point: {
          events: {
            click: function(event: any) {
              // удаление точки по shift + клик (в частности для трафа)
              if (event.shiftKey) {
                this.series.chart.tooltip.hide();
                this.series.data[this.index].remove();
                return true;
              }
              return false;
            },
          } as any,
        },
      },
    },
    xAxis: {
      labels: {
        autoRotationLimit: 0,
      },
    },
  });

  if (options.echart.chart.type === 'column') {
    params.plotOptions.series.dataLabels = {
      crop: false,
      allowOverlap: true,
      overflow: 'allow',
      style: {
        textOutline: '2px contrast',
      },
      padding: 2,
    };

    params.plotOptions.column = {
      groupPadding: 0.1,
    };
  }

  options.showLegendManageLine =
    !options.removeShowHideAll && params.series.length > COUNT_ROWS_FOR_FORCE_HIDE;

  if (options.showLegendManageLine) {
    params.series.push({
      color: '#ffffff',
      legendIndex: -10000,
      type: 'line',
      data: [],
      zIndex: 10,
      name: LEGEND_MANAGE_SERIE,
    });
  }

  if (options.echart && options.echart.tooltip && options.echart.tooltip.formatter) {
    const formatter = options.echart.tooltip.formatter;
    params.tooltip.formatter = function(tooltip: any): string {
      return `<div">${formatter.call(this, tooltip)}</div>`;
    };
    delete options.echart.tooltip.formatter;
  }

  if (
    params.legend.enabled === undefined &&
    ['pie', 'heatmap', 'treemap'].indexOf(options.type) === -1 &&
    ['pie', 'heatmap', 'treemap'].indexOf(
      options.echart && options.echart.chart && options.echart.chart.type,
    ) === -1
  ) {
    params.legend.enabled = params.series.length > 1;
  }

  if (
    options &&
    options.echart &&
    options.echart.plotOptions &&
    options.echart.plotOptions.series &&
    options.echart.plotOptions.series.dataLabels
  ) {
    options.echart.plotOptions.series.dataLabels.format = undefined;
  }

  if (options && options.echart && options.echart.chart.type === 'pie') {
    options.echart.legend.enabled = true;
    options.echart.plotOptions = {
      ...options.echart.plotOptions,
      pie: {
        dataLabels: {
          format: undefined,
          enabled: false,
        },
      },
    };

    //@ts-ignore
    if ($appSettingsStore.getState().exportMode) {
      options.echart.plotOptions.pie.dataLabels.enabled = true;
    }
  }

  // TODO: очень неправильно ориентироваться на этот параметр из Config
  // TODO: но некоторые используют stock, например, с categories
  if (options.highstock) {
    params.rangeSelector = {
      inputEnabled: false,
      enabled: false,
    };

    params.useHighStock = true;

    params.navigator = {
      height: 30,
    };

    buildNavigator(params.series, options);
  }

  merge(params, getTypeParams(data, options));

  if (options.hideHolidays && !options.highstock) {
    params.xAxis.ordinal = true;
    params.xAxis.startOnTick = true;
    params.xAxis.endOnTick = true;
    params.xAxis.showFirstLabel = false;
    params.xAxis.showLastLabel = false;
  }

  if (Array.isArray(options.hide_series)) {
    params.series.forEach((serie: any) => {
      if (options.hide_series.indexOf(serie.name) !== -1) {
        serie.visible = false;
      }
    });
  }

  mergeWith(params, options.echart, (a, b) => {
    // на случай, если кто-то переопределяет события
    // a !== b, например, для случая yAxis.labels.formatter
    if (typeof a === 'function' && typeof b === 'function' && a !== b) {
      return function(event: any, ...args: any): any {
        //@ts-ignore
        a.call(this, event, ...args);
        // в частности для Трафа, который по клику на чарт триггерит событие, чтобы не уйти в цикл
        if (!event || event.isTrusted !== false) {
          //@ts-ignore
          return b.call(this, event, ...args);
        }
      };
    }
  });

  // https://github.com/highcharts/highcharts/issues/5671
  // http://jsfiddle.net/yo12kv0b/
  if (params.plotOptions.area && params.plotOptions.area.stacking === 'normal') {
    params.series.forEach((serie: any) => {
      if (serie.type === undefined) {
        let hasNegativeValues = false;
        let hasPositiveValues = false;

        serie.data.forEach((value: any) => {
          let actualValue = value;
          if (Array.isArray(value)) {
            actualValue = value[1];
          } else if (value && typeof value.y === 'number') {
            actualValue = value.y;
          }

          if (actualValue > 0) {
            hasPositiveValues = true;
          } else if (actualValue < 0) {
            hasNegativeValues = true;
          }
        });

        if (hasPositiveValues && !hasNegativeValues) {
          serie.stack = 'positive';
        } else if (!hasPositiveValues && hasNegativeValues) {
          serie.stack = 'negative';
        }
      }
    });
  }

  return params;
};
