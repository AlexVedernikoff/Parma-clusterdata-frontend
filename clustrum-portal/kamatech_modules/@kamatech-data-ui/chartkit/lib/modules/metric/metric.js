import React from 'react';
import ReactDOM from 'react-dom';

import ReactHighcharts from './ReactHighcharts/ReactHighcharts';
import formatMetric from './template';
import ErrorDispatcher, { ERROR_TYPE } from '../error-dispatcher/error-dispatcher';

// import './metric.scss';

const GREEN_BACKGROUND = '#e2ffd4'; // для текста и графика(более темный)
const GREEN_COLOR = '#080'; // для цвета самого виджета (более светлый)
const RED_BACKGROUND = '#ffd4d4';
const RED_COLOR = '#800';

const graphOptions = {
  xAxis: {
    visible: false,
    startOnTick: false,
    endOnTick: false,
    tickWidth: 0,
  },
  yAxis: {
    visible: false,
    endOnTick: false,
    startOnTick: false,
    tickWidth: 0,
  },
  legend: {
    enabled: false,
  },
  tooltip: {
    backgroundColor: null,
    hideSeriesName: true, // кастомная штука
    shadow: false,
    shared: true,
    padding: 0,
    hideDelay: 100,
    positioner: function(w, h, point) {
      return { x: point.plotX - w / 2, y: point.plotY - h };
    },
  },
  plotOptions: {
    series: {
      animation: false,
      lineWidth: 1,
      shadow: false,
      states: {
        hover: {
          lineWidth: 1,
        },
      },
      marker: {
        radius: 1,
        states: {
          hover: {
            radius: 2,
          },
        },
      },
      fillOpacity: 0.25,
      color: '#000',
    },
    column: {
      negativeColor: '#910000',
      borderColor: 'silver',
    },
    areaspline: {
      marker: {
        enabled: false,
      },
    },
    spline: {
      marker: {
        enabled: false,
      },
    },
  },
  chart: {
    width: 130,
    height: 60,
    marginRight: 10,
    backgroundColor: 'transparent',
    style: {
      overflow: 'visible',
    },
  },
};

function ChartMetric(config, data) {
  // TODO: проверять, что нет данных до отрисовки?
  // TODO: например, если пустое значение, или массив без элементов
  if (!data || (Array.isArray(data) && !data.length)) {
    throw ErrorDispatcher.wrap({ type: ERROR_TYPE.NO_DATA });
  }

  data = Array.isArray(data) ? data : [data];

  this.config = config || {};
  this.container = $('<div>');
  // this.container.addClass(`${BASE_CLASS}-metric`);
  this.data = this.prepareConfig(data);

  this.draw();

  return { htmlElement: this.container[0] };
}

ChartMetric.prototype.processConfig = function(data) {
  var content = $.extend(true, {}, data.content),
    formattedValue,
    diff;

  if (content) {
    if (content.current && content.current.formatted) {
      formattedValue = this.formatValue(content.current.value);

      data.content.current.value = formattedValue.value;
      data.content.current.sign = formattedValue.sign;
      data.content.current.unit = data.content.current.unit
        ? formattedValue.unit + data.content.current.unit
        : formattedValue.unit;
    }
    if (content.last && content.last.formatted) {
      formattedValue = this.formatValue(content.last.value);

      data.content.last.value = formattedValue.value;
      data.content.last.sign = formattedValue.sign;
      data.content.last.unit = data.content.last.unit
        ? formattedValue.unit + data.content.last.unit
        : formattedValue.unit;
    }
    if (content.diff && (content.diff.formatted || content.diff.value == undefined)) {
      if (
        content.diff.value == undefined &&
        (content.last.value == undefined || content.current.value == undefined)
      ) {
        delete content.diff;
      } else {
        diff = Number(content.current.value) - Number(content.last.value);
        formattedValue = this.formatValue(
          content.diff.value == undefined ? diff : content.diff.value,
          true,
        );

        data.content.diff.value = formattedValue.value;
        data.content.diff.sign = formattedValue.sign;
        data.content.diff.unit = data.content.diff.unit
          ? formattedValue.unit + data.content.diff.unit
          : formattedValue.unit;
      }
    }
    if (
      content.diffPercent &&
      (content.diffPercent.formatted || content.diffPercent.value == undefined)
    ) {
      if (
        content.diffPercent.value == undefined &&
        (content.last.value == undefined || content.current.value == undefined)
      ) {
        delete content.diffPercent;
      } else {
        diff =
          (Number(content.current.value) - Number(content.last.value)) /
          Number(content.last.value);
        formattedValue = this.formatValue(
          content.diffPercent.value == undefined ? diff : content.diffPercent.value,
          true,
          'percentage',
        );

        data.content.diffPercent.value = formattedValue.value;
        data.content.diffPercent.sign = formattedValue.sign;
        data.content.diffPercent.unit = data.content.diffPercent.unit
          ? formattedValue.unit + data.content.diffPercent.unit
          : formattedValue.unit;
      }
    }
  }

  if (data.colorize && !data.background) {
    data.background = this.getBackground(data, GREEN_BACKGROUND, RED_BACKGROUND);
  }

  if (
    data.colorize &&
    data.chart &&
    Array.isArray(data.chart.graphs) &&
    !data.chart.graphs[0].color
  ) {
    data.chart.graphs[0].color = this.getBackground(data, GREEN_COLOR, RED_COLOR);
  }

  return data;
};

ChartMetric.prototype.prepareConfig = function(data) {
  return data.map(function(item) {
    return this.processConfig(item);
  }, this);
};

ChartMetric.prototype.formatValue = function(value, withSign, format) {
  var suffixes = ['', 'k', 'M', 'G', 'T', 'P'],
    rank = 0,
    unit = '',
    sign = '';

  if (isNaN(value) || value === null) {
    return {
      value: '–',
    };
  }

  value = Number(value);

  if (value < 0) {
    sign = '-';
    value = Math.abs(value);
  } else {
    if (withSign) {
      sign = '+';
    }
  }

  switch (format) {
    case 'percentage':
      value = value * 100;
      unit = '%';
      break;
    default:
      while (Math.round(value) >= 999.5) {
        // 999.5 because greater values will be rounded to 1000
        value = value / 1000;
        rank++;
      }
      unit = suffixes[rank];
  }

  if (Math.floor(value) !== value) {
    if (value < 1) {
      value = value.toFixed(2);
    } else {
      value = value.toPrecision(3);
    }
  }

  return {
    value: value,
    unit: unit,
    sign: sign,
  };
};

ChartMetric.prototype.getBackground = function(data, green, red) {
  var content = data.content,
    background,
    diffContent;

  if (content.diffPercent) {
    diffContent = content.diffPercent;
  } else if (content.current.value != undefined && content.last.value) {
    diffContent = this.formatValue(
      (Number(content.current.value) - Number(content.last.value)) /
        Number(content.last.value),
      true,
      'percentage',
    );
  }

  if (diffContent) {
    var diff = diffContent.value,
      diffSign = diffContent.sign;

    var getBackgroundByDiff = function(moreGreen) {
      if (diff) {
        if (!data.colorizeInterval || Math.abs(diff) > data.colorizeInterval) {
          var isDiffPositive = diff > 0 && diffSign !== '-';

          return isDiffPositive === moreGreen ? green : red;
        }
      } else {
        return '';
      }
    };

    if (data.colorize && diff) {
      switch (data.colorize) {
        case 'more-green':
          background = getBackgroundByDiff(true);
          break;
        case 'less-green':
          background = getBackgroundByDiff(false);
          break;
      }
    }
  }

  return background;
};

ChartMetric.prototype.generateChart = function(metricData, chartContainer) {
  // Generate chart through highchart
  if (metricData.chart && metricData.chart.graphs) {
    var data = metricData.chart || {},
      config = {
        dataSources: this.config.dataSources,
        chartType: 'editor',
        width: '100%',
        highcharts: {},
      };

    $.extend(true, config, this.config.statface_graph, { highcharts: graphOptions });
    config.container = chartContainer;
    config.wrapper = chartContainer;

    if (
      !data ||
      (typeof data === 'object' && !Object.keys(data).length) ||
      (data.graphs &&
        !(
          data.graphs.length && data.graphs.some(graph => graph.data && graph.data.length)
        )) ||
      (Array.isArray(data) && !data.length)
    ) {
      return null;
      // throw ErrorDispatcher.wrap({type: ERROR_TYPE.NO_DATA});
    }

    try {
      const renderConfig = getGraph(config, data);
      ReactDOM.render(
        <ReactHighcharts chartType="Chart" {...renderConfig} />,
        chartContainer,
      );
    } catch (error) {
      console.error('METRIC_CHART_RENDER', error);
      return null;
      // throw ErrorDispatcher.wrap({type: ERROR_TYPE.RENDER_ERROR, error});
    }
  }
};

ChartMetric.prototype.draw = function() {
  // Очищаем контайнер
  this.container.empty();

  this.data.forEach(function(item) {
    var content = $(formatMetric(item)),
      chartContainer = $('.chart-metric__chart', content)[0];

    this.container.append(content);
    this.generateChart(item, chartContainer);
  }, this);
};

export default ChartMetric;
