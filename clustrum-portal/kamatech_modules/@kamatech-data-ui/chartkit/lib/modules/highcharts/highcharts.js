import Highcharts from 'highcharts';

import colors from './colors';

function formatQ(timestamp) {
  const date = new Date(timestamp);
  const month = date.getUTCMonth() + 1;
  return 'Q' + Math.ceil(month / 3);
}

// выставляем общие опции для Highcharts, Highstock, Highmaps

Highcharts.dateFormats = {
  Q: formatQ,
  q: formatQ,
  quarter: formatQ,
};

Highcharts.setOptions({
  lang: {
    decimalPoint: ',',
    thousandsSep: ' ',
  },
  colors: colors,
  credits: {
    enabled: false,
  },
  chart: {
    animation: false,
    displayErrors: false,
    resetZoomButton: {
      relativeTo: 'chart',
    },
    style: {
      position: 'initial', // чтобы тултип выходил за границы highcharts-container
    },
  },
  title: {
    text: '',
    style: {
      fontSize: '15px',
      fontWeight: 'bold',
    },
  },
  legend: {
    enabled: true,
    itemStyle: {
      fontWeight: 'normal',
    },
  },
  tooltip: {
    borderRadius: '0px',
    borderWidth: 0,
    useHTML: true,
    hideDelay: 100,
  },
  xAxis: {
    gridLineColor: '#dbdbdb',
    gridLineWidth: 1,
    lineColor: '#dbdbdb',
  },
  yAxis: {
    title: {
      text: null,
    },
  },
  plotOptions: {
    series: {
      animation: false,
      connectNulls: false,
    },
  },
});

function init() {
  // вкладка Highcharts нодового графика в форматере может использовать Highcharts
  window.Highcharts = Highcharts;

  /* eslint-disable max-len */
  Highcharts.setOptions({
    lang: {
      decimalPoint: ',',
      thousandsSep: ' ',
      resetZoom: 'Сбросить увеличение',
      months: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
      ],
      shortMonths: [
        'Янв',
        'Фев',
        'Мар',
        'Апр',
        'Май',
        'Июн',
        'Июл',
        'Авг',
        'Сен',
        'Окт',
        'Ноя',
        'Дек',
      ],
      weekdays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    },
  });
  /* eslint-enable max-len */
}

export default init;
