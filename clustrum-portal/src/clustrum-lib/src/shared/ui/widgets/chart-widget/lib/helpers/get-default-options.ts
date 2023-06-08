function getTooltipHeaderFormat(format: any, showColor: boolean): string {
  return `<div class="chartkit-tooltip__header">
        ${
          showColor
            ? `<span class="chartkit-tooltip__color" style="background-color:{point.color};"></span>`
            : ''
        }
        ${format}
    </div>`;
}

function getTooltipPointFormat(cells: any, showColor: boolean): string {
  return `<div class="chartkit-tooltip__row">
        ${
          showColor
            ? `<div class="chartkit-tooltip__cell">
                <span class="chartkit-tooltip__color" style="background-color:{point.color};"></span>
            </div>`
            : ''
        }
        ${cells
          .map((cell: any) => `<div class="chartkit-tooltip__cell">${cell}</div>`)
          .join('')}
    </div>`;
}

const first = {
  states: {
    hover: {
      lineWidth: 3,
    },
  },
  turboThreshold: 0,
  dataGrouping: {
    approximation: 'open',
  },
  marker: {
    enabled: false,
    radius: 3,
    states: {
      hover: {
        radiusPlus: 1,
      },
    },
  },
};

const second = {
  allowPointSelect: true,
  slicedOffset: 20,
  cursor: 'pointer',
  showInLegend: true,
};

export default {
  chart: {
    zoomType: false,
    backgroundColor: 'transparent',
    className: 'chartkit-graph',
    spacingLeft: 2,
    spacingRight: 0,
    spacingBottom: 5,
    style: {
      fontFamily: 'var(--highcharts-font-family)',
      fontFeatureSettings: 'var(--highcharts-font-feature-settings)',
    },
  },
  title: {
    style: {
      color: 'var(--highcharts-title)',
    },
  },
  tooltip: {
    split: false,
    shared: true,
    dateTimeLabelFormats: {
      millisecond: '%d %B %Y %H:%M:%S.%L',
      second: '%d %B %Y %H:%M:%S',
      minute: '%d %B %Y %H:%M',
      hour: '%d %B %Y %H:%M',
      day: '%d %B %Y',
      week: '%d %B %Y',
      quarter: "%Q'%Y",
    },
    outside: true,
    followPointer: false,
  },
  legend: {
    itemStyle: {
      color: 'var(--highcharts-legend-item)',
    },
    itemHoverStyle: {
      color: 'var(--highcharts-legend-item-hover)',
    },
    itemHiddenStyle: {
      color: 'var(--highcharts-legend-item-hidden)',
    },
    margin: 0,
    itemDistance: 5,
  },
  xAxis: {
    gridLineColor: 'var(--highcharts-grid-line-xaxis)',
    lineColor: 'var(--highcharts-axis-line)',
    labels: {
      style: {
        color: 'var(--highcharts-axis-labels)',
      },
    },
    tickColor: 'var(--highcharts-tick)',
    tickmarkPlacement: 'on',
    dateTimeLabelFormats: {
      day: '%d.%m.%y',
      week: '%d.%m.%y',
      quarter: "%Q'%Y",
    },
  },
  yAxis: {
    gridLineColor: 'var(--highcharts-grid-line-yaxis)',
    lineColor: 'var(--highcharts-axis-line)',
    labels: {
      style: {
        color: 'var(--highcharts-axis-labels-yaxis)',
      },
      x: -5,
    },
    tickColor: 'var(--highcharts-tick)',
    tickPixelInterval: 38,
  },
  plotOptions: {
    series: {
      // series-label модуль
      label: {
        enabled: false,
      },
      tooltip: {
        headerFormat: getTooltipHeaderFormat('{point.key}', false),
        pointFormat: getTooltipPointFormat(['{point.y}', '{series.name}'], true),
      },
      dataLabels: {
        style: {
          // в частности для treemap и pie
          textOutline: 'none',
          color: 'var(--highcharts-data-labels)',
        },
      },
    },
    area: Object.assign(
      {
        // отключаем boost для area, т.к. выглядит это набором тонких линий https://jsfiddle.net/2ahd7c9b
        boostThreshold: 0,
      },
      first,
    ),
    areaspline: first,
    bar: Object.assign(
      {
        borderWidth: 0,
        pointWidth: 4,
      },
      first,
    ),
    column: Object.assign(first),
    line: Object.assign(first),
    spline: first,
    arearange: Object.assign(
      {
        tooltip: {
          // headerFormat: getTooltipHeaderFormat('{point.key}'),
          pointFormat: getTooltipPointFormat(
            ['{point.low} - {point.high}', '{series.name}'],
            true,
          ),
        },
      },
      first,
    ),
    scatter: {
      tooltip: {
        headerFormat: getTooltipHeaderFormat('{series.name}', true),
        pointFormat: getTooltipPointFormat(
          ['<div>X: {point.x}</div><div>Y: {point.y}<div/>'],
          false,
        ),
      },
    },
    bubble: {
      tooltip: {
        headerFormat: getTooltipHeaderFormat('{series.name}', true),
        // TODO: i18n('Размер')
        pointFormat: getTooltipPointFormat(
          ['({point.x}, {point.y}), Размер: {point.z}'],
          false,
        ),
      },
    },
    sankey: {
      tooltip: {
        headerFormat: getTooltipHeaderFormat('{series.name}', true),
        pointFormat: getTooltipPointFormat(
          ['{point.fromNode.name} → {point.toNode.name}: <b>{point.weight}</b>'],
          false,
        ),
      },
    },
    heatmap: {
      tooltip: {
        headerFormat: getTooltipHeaderFormat('{series.name}', true),
        pointFormat: getTooltipPointFormat(
          ['{point.x}, {point.y}: {point.value}'],
          false,
        ),
      },
    },
    treemap: {
      tooltip: {
        headerFormat: null,
        pointFormat: getTooltipPointFormat(['<b>{point.name}</b>: {point.value}'], false),
      },
    },
    pie: Object.assign(
      {
        borderWidth: 0,
        innerSize: '55%',
        colors: [
          '#008CFF',
          '#4FA730',
          '#FF7900',
          '#99D1FF',
          '#B9DCAC',
          '#FFC999',
          '#0069BF',
          '#3B7D24',
          '#BF5B00',
          '#EF4444',
        ],
        tooltip: {
          headerFormat: null,
          pointFormat: getTooltipPointFormat(['{point.y}', '{point.name}'], true),
        },
        states: {
          hover: {
            halo: {
              size: 0,
            },
          },
          inactive: {
            opacity: 1,
          },
        },
      },
      second,
    ),
    histogram: {
      tooltip: {
        headerFormat: null,
        pointFormat:
          getTooltipHeaderFormat('{point.x} - {point.x2}', false) +
          getTooltipPointFormat(['{point.y}', '{series.name}'], true),
      },
    },
    ohlc: {
      tooltip: {
        pointFormat:
          getTooltipPointFormat(['{series.name}'], true) +
          getTooltipPointFormat(['', '{point.open}', 'Open'], false) +
          getTooltipPointFormat(['', '{point.high}', 'High'], false) +
          getTooltipPointFormat(['', '{point.low}', 'Low'], false) +
          getTooltipPointFormat(['', '{point.close}', 'Close'], false),
      },
    },
    solidgauge: second,
    funnel: second,
  },
  exporting: { buttons: { contextButton: { enabled: false } } },
};
