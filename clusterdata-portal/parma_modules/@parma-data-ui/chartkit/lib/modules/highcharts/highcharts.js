import Highcharts from 'highcharts';

import colors from './colors';
import i18nFactory from '../i18n/i18n';

const i18n = i18nFactory('highcharts');

function formatQ(timestamp) {
    const date = new Date(timestamp);
    const month = date.getUTCMonth() + 1;
    return 'Q' + Math.ceil(month / 3);
}

// выставляем общие опции для Highcharts, Highstock, Highmaps

Highcharts.dateFormats = {
    Q: formatQ,
    q: formatQ,
    quarter: formatQ
};

Highcharts.setOptions({
    lang: {
        decimalPoint: ',',
        thousandsSep: ' '
    },
    colors: colors,
    credits: {
        enabled: false
    },
    chart: {
        animation: false,
        displayErrors: false,
        resetZoomButton: {
            relativeTo: 'chart'
        },
        style: {
            position: 'initial' // чтобы тултип выходил за границы highcharts-container
        }
    },
    title: {
        text: '',
        style: {
            fontSize: '15px',
            fontWeight: 'bold'
        }
    },
    legend: {
        enabled: true,
        itemStyle: {
            fontWeight: 'normal'
        }
    },
    tooltip: {
        borderRadius: '0px',
        borderWidth: 0,
        useHTML: true,
        hideDelay: 100
    },
    xAxis: {
        gridLineColor: '#dbdbdb',
        gridLineWidth: 1,
        lineColor: '#dbdbdb'
    },
    yAxis: {
        title: {
            text: null
        }
    },
    plotOptions: {
        series: {
            animation: false,
            connectNulls: false
        }
    }
});

function init() {
    // вкладка Highcharts нодового графика в форматере может использовать Highcharts
    window.Highcharts = Highcharts;

    /* eslint-disable max-len */
    Highcharts.setOptions({
        lang: {
            decimalPoint: ',',
            thousandsSep: ' ',
            resetZoom: i18n('reset-zoom'),
            months: [i18n('January'), i18n('February'), i18n('March'), i18n('April'), i18n('May'), i18n('June'), i18n('July'), i18n('August'), i18n('September'), i18n('October'), i18n('November'), i18n('December')],
            shortMonths: [i18n('Jan'), i18n('Feb'), i18n('Mar'), i18n('Apr'), i18n('May'), i18n('Jun'), i18n('Jul'), i18n('Aug'), i18n('Sep'), i18n('Oct'), i18n('Nov'), i18n('Dec')],
            weekdays: [i18n('Sun'), i18n('Mon'), i18n('Tue'), i18n('Wed'), i18n('Thu'), i18n('Fri'), i18n('Sat')]
        }
    });
    /* eslint-enable max-len */
}

export default init;
