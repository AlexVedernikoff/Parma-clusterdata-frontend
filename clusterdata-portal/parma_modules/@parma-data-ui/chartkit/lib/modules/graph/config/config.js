import Highcharts from 'highcharts';
import block from 'bem-cn-lite';
import merge from 'lodash/merge';
import mergeWith from 'lodash/mergeWith';

import ExtensionsManager, {EXTENSION_KEY} from '../../extensions-manager/extensions-manager';
import defaultOptions from './options';
import i18nFactory from '../../i18n/i18n';
import {getCommentsOnLine, drawComments, hideComments, drawOnlyRendererComments} from '../../comments/drawing';
import ChartKit from '../../../components/ChartKit/ChartKit';
import formatTooltip from '../tooltip/tooltip';
import {MEASURE_TYPE} from '../../../../../../../src/constants';

const i18n = i18nFactory('chartkit');
const b = block('chartkit-tooltip');

const COUNT_ROWS_FOR_FORCE_HIDE = 4;

const LEGEND_MANAGE_SERIE = 'legend_manage_serie';

const CUSTOM_TYPES = {
    stack: {
        type: 'area',
        stacking: 'normal'
    },
    stacked_100p: {
        type: 'area',
        stacking: 'percent'
    },
    stacked_column: {
        type: 'column',
        stacking: 'normal'
    },
    stacked_column_100p: {
        type: 'column',
        stacking: 'percent'
    }
};

function isManageSerie(serie) {
    // TODO: брать из константы
    return serie.name === LEGEND_MANAGE_SERIE;
}

function buildLegend(options) {
    const legend = {
        alignColumns: false,
        labelFormatter: function () {
            if (isManageSerie(this)) {
                return `<span style="color: gray;">${i18n('legend-series-hide', 'Chart')}</span>`;
            } else {
                return this.name;
            }
        }
    };

    // if (settings.outsideLegend) {
    //     params.legend.floating = false;
    //     delete (params.chart.marginBottom);
    // }

    if (options.outsideLegend) {
        options.legendPosition = null;
    }

    if (options.legendResetMargin || options.outsideLegend) {
        legend.y = 0;
        legend.x = 0;
    }

    // if (!options.asIsLegend) {
    //     // w100@: для нижних значений делаем отступы от шкалы
    //     if (options.legendPosition >= 4 && options.legendPosition <= 8) {
    //         if (options.highstock) {
    //             legend.margin = -38;
    //             legend.y -= 110;
    //         } else {
    //             legend.y -= 50;
    //         }
    //     }
    //
    //     // w100@: для "левых" значений делаем отступ, чтобы не затирать значения оси
    //     if (options.legendPosition >= 7 && options.legendPosition <= 11) {
    //         legend.x = 45;
    //     }
    //
    //     if (options.legendPosition == 4 || options.legendPosition == 8) {
    //         legend.y += -45;
    //     }
    //
    //     if (params.legend.verticalAlign == 'top') {
    //         if (params.title.text) {
    //             legend.y += 20;
    //         }
    //         if (params.subtitle.text) {
    //             legend.y += 15;
    //         }
    //     }
    // }

    // проверяем, нужна ли плавающая легенда, position - цифра на часовом циферблате
    if (typeof options.legendPosition === 'number' && options.legendPosition >= 1 && options.legendPosition <= 12) {
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

        // if (params.legend.verticalAlign == 'top') {
        //     if (params.title.text) {
        //         legend.y += 20;
        //     }
        //     if (params.subtitle.text) {
        //         legend.y += 15;
        //     }
        // }
    }

    return legend;
}

function hasChartVisibleSeries(chart) {
    return chart && Array.isArray(chart.series) && chart.series.some((serie) => !isManageSerie(serie) && serie.visible);
}

function hasChartManageSerie(chart) {
    return chart && Array.isArray(chart.series) && chart.series.some((serie) => isManageSerie(serie));
}

function manageLegend(chart) {
    if (chart && hasChartManageSerie(chart)) {
        const text = hasChartVisibleSeries(chart) ?
            i18n('legend-series-hide') :
            i18n('legend-series-show');

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

function legendShowHide(serie, type, vaultId) {
    if (serie.options.className === 'highcharts-navigator-series') {
        // TODO: в случае навигатора если скрыть линию, которая есть внутри highstock и перерисовать график,
        // TODO: то на графике линии не будет, но в highstock будет
        // линия внутри highstock
        return;
    }
    if (isManageSerie(serie)) {
        const visible = hasChartVisibleSeries(serie.chart);

        serie.chart.series.forEach((item) => {
            if (!isManageSerie(item)) {
                if (visible) {
                    serie.chart.series[item.index].hide();
                } else {
                    serie.chart.series[item.index].show();
                }
            }
        });
    } else {
        // TODO: будет реализовываться на уровне состояний графика
        // TODO: не работать с индексами, т.к. линии могут добавляться/удаляться как, например, на Трафе
        // const {redraw: {hiddenSeriesIndexes}} = ChartKit.openVault(vaultId);
        //
        // if (type === 'show') { // if (isNotManageItem(serie))
        //     const legendItemIndex = hiddenSeriesIndexes.indexOf(serie.index);
        //     if (legendItemIndex > -1) {
        //         hiddenSeriesIndexes.splice(legendItemIndex, 1);
        //     }
        // }
        //
        // if (type === 'hide') { // if (isNotManageItem(serie)) {
        //     if (hiddenSeriesIndexes.indexOf(serie.index) === -1) {
        //         hiddenSeriesIndexes.push(serie.index);
        //     }
        // }
    }

    manageLegend(serie.chart);

    // if (vaultId) {
    //     const {
    //         chart,
    //         menu: {
    //             comments = [],
    //             data: {comments: dataComments = []} = {},
    //             config
    //         }
    //     } = ChartKit.openVault(vaultId);
    //     const allComments = comments.concat(dataComments);
    //
    //     if (allComments.length) {
    //         // TODO: как-то не круто
    //         hideComments(chart, allComments, config);
    //         drawComments(chart, allComments, config);
    //     }
    // }

    hideComments(serie.chart, serie.chart.userOptions._comments, serie.chart.userOptions._config);
    drawComments(serie.chart, serie.chart.userOptions._comments, serie.chart.userOptions._config);
}

function buildNavigator(graphs, options) {
    const baseSeriesName = options.highstock.base_series_name || '';
    let showInNavigator;

    graphs.forEach((item) => {
        if (typeof item.showInNavigator === 'undefined') {
            item.showInNavigator =
                item.sname === baseSeriesName || item.name === baseSeriesName || item.title === baseSeriesName;
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

function prepareHolidays(data, options) {
    const bands = [];
    const region = (options.region || 'TOT').toLowerCase();
    const HALF_DAY = 43200000;

    const HOLIDAYS = ExtensionsManager.get(EXTENSION_KEY.HOLIDAYS);

    data.categories_ms.forEach((item) => {
        const pointTimestamp = Number(Highcharts.dateFormat('%Y%m%d', item));
        const holidayByRegion = HOLIDAYS.holiday[region];
        const weekendByRegion = HOLIDAYS.weekend[region];

        if ((holidayByRegion && holidayByRegion[pointTimestamp])
            || (weekendByRegion && weekendByRegion[pointTimestamp])) {
            const bandStart = item - HALF_DAY;
            const bandStop = item + HALF_DAY;

            if (bands.length && bandStart === bands[bands.length - 1].to) {
                bands[bands.length - 1].to = bandStop;
            } else {
                bands.push({from: bandStart, to: bandStop});
            }
        }
    });

    return bands.map((key) => {
        return {
            className: 'chartkit-graph__holiday-band',
            from: key.from,
            to: key.to
        };
    });
}

// TODO: рефакторить
function prepareZones(options) {
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
                    'font-size': '8pt'
                }}
        };

        plotbands.push(nowzone);
    }

    return plotbands;
}

function getTypeParams(data, options, vaultId) {
    // Начиная с версии 1.3.5 нужно немного тюнить положение подписей
    const params = {xAxis: {labels: {y: 15}}};
    const period = options.period;

    if (data.categories_ms) {
        params.xAxis.type = 'datetime';
        params.xAxis.labels.staggerLines = 1;
    } else {
        const flag = options.type === 'line' || options.type === 'area';
        params.xAxis.startOnTick = flag;
        params.xAxis.endOnTick = flag;

        // let longestCategory = 0;

        if (data.categories) {
            params.xAxis.categories = data.categories;
            // params.xAxis.tickInterval = Math.ceil(data.categories.length * 40 / that.getWidth('count'));
            // data.categories.forEach((category) => {
            //     longestCategory = Math.max(longestCategory, category.toString().length);
            // });
        }

        // params.xAxis.labels = {
        //     y: Math.max(longestCategory * 3, 30),
        //     formatter: function () {
        //         const value = this.value;
        //         let hasVal = true;
        //
        //         try {
        //             if (typeof this.value === 'number') {
        //                 // TODO: wat?
        //                 // $.each(this.chart.series, function () {
        //                 //     if ($.inArray(value, data.categories) === -1) {
        //                 //         hasVal = false;
        //                 //     }
        //                 // });
        //             }
        //         } catch (e) {
        //             console.error(e);
        //         }
        //
        //         return hasVal ? value : '';
        //     }
        // };
    }

    if (options.highstock) {
        params.xAxis.events = {};
        params.xAxis.events.setExtremes = (e) => {
            // TODO зачем?
            // if (context.load_navigator) {
            //     setTimeout(() => {
            //         context.load_navigator = false;
            //         context.openComments();
            //         setTimeout(() => { context.load_navigator = true; }, 0);
            //     }, 0);
            // } else {
            //     context.load_navigator = true;
            // }
            // if (vaultId) {
            //     ChartKit.openVault(vaultId).store({
            //         redraw: {
            //             extremes: {
            //                 min: e.min,
            //                 max: e.max
            //             }
            //         }
            //     });
            //     const chart = e.target.chart;
            //     // TODO: как-то совсем некруто
            //     if (chart.userOptions.isLoaded) {
            //         const {
            //             menu: {comments = [], data: {comments: dataComments = []} = {}, config}
            //         } = ChartKit.openVault(vaultId);
            //         const allComments = comments.concat(dataComments);
            //         if (allComments.length) {
            //             hideComments(chart, allComments, config);
            //             drawComments(chart, allComments, config);
            //         }
            //     }
            // }

            const chart = e.target.chart;
            if (chart.userOptions.isLoaded) {
                hideComments(chart, chart.userOptions._comments, chart.userOptions._config);
                drawComments(chart, chart.userOptions._comments, chart.userOptions._config);
            }
        };
    }

    if (options.highcharts && options.highcharts.yAxis && options.highcharts.yAxis.length) {
        options.highcharts.yAxis.forEach((axis) => {
            // TODO: wat?
            // if (!(axis.min || axis.floor) && options.min >= 0) {
            //     axis.floor = 0;
            // }
        });
        params.yAxis = options.highcharts.yAxis;
    } else {
        params.yAxis = {
            plotLines: [{
                value: 0,
                width: 1
            }],
            labels: {}
        };

        // TODO: проверить это
        if (options.isPercent) {
            params.yAxis.labels.formatter = function () {
                const isNormalize = options.normalizeDiv || options.normalizeSub;
                return Highcharts.Axis.prototype.defaultLabelFormatter.call(this) + (isNormalize ? '' : ' %');
            };
        }

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
        } else if (options.min > 0 && (options.max / options.min > 8)) { // 8 is a strange empirically obtained constant
            params.yAxis.floor = 0;
        }
    }

    // показываем выходные только для дневного скейла и для периода > 3 суток
    if (options.scale === 'd'
        && !options.hideHolidaysBands
        && data.categories_ms
        && period > 259200000
        && ExtensionsManager.has(EXTENSION_KEY.HOLIDAYS)) {
        params.xAxis.plotBands = prepareHolidays(data, options);
    }

    if (options.zones) {
        params.yAxis.plotBands = prepareZones(options);
    }

    return params;
}

// TODO: смержить с getPlotOptions
// function expandType(options) {
//     const customType = CUSTOM_TYPES[options.type];
//
//     if (customType) {
//         options.originalType = options.type;
//         options.type = customType.type;
//         options.stacking = customType.stacking;
//     }
//
//     options.type = options.type || 'line';
// }

// function getPlotOptions(options, overrideType) {
//     const data = {};
//
//     // TODO: некорректный тип, если он задан на вкладке Highcharts: {chart: {type: ...}}
//     let key = overrideType || options.originalType;
//
//     switch (key) {
//         case 'stack':
//         case 'stacked_100p':
//         case 'stacked_column':
//         case 'stacked_column_100p':
//             key = options.type;
//             data.stacking = options.stacking || 'normal';
//             // TODO: не круто
//             options.enableSum = options.enableSum == undefined ? true : options.enableSum;
//             break;
//         case 'column':
//             // TODO: почему в if?
//             // TODO: параметр stacking?
//             if (options.stacking) {
//                 data.stacking = options.stacking === 'percent' ? 'percent' : 'normal';
//                 options.stacking = data.stacking;
//             }
//             break;
//     }
//
//     return [key, data];
// }

function calculatePrecision(alternativePrecision, options) {
    let precision;
    if (options.normalizeDiv || options.normalizeSub) { precision = 2; }
    if (options.precision || options.precision === 0) { precision = options.precision; }
    if (!precision && (alternativePrecision || alternativePrecision === 0)) { precision = alternativePrecision; }
    return precision;
}

export function numberFormat(val, round) {
    if (parseInt(val, 10) === val) {
        if (typeof round === 'number') {
            val = val.toFixed(round);
            return (Highcharts.numberFormat(val, Math.min(round, 20), ',', ' '));
        } else {
            return (Highcharts.numberFormat(val, 0, ',', ' '));
        }
    } else if (val) {
        if (typeof round !== 'number') {
            round = val.toString().split('.')[1].length;
        }
        val = val.toFixed(round);
        return (Highcharts.numberFormat(val, Math.min(round, 20), ',', ' '));
    }
    return null;
}

function getTooltip(tooltip, options, comments) {
    const serieType = this.series && this.series.type || tooltip.chart.options.chart.type;
    const chart = tooltip.chart;
    const xAxis = chart.xAxis[0];
    const isDatetimeXAxis = xAxis.isDatetimeAxis;

    let json;

    if (['pie', 'funnel', 'solidgauge'].includes(serieType)) {
        json = {
            lines: [{
                value: Highcharts.numberFormat(this.y, 1),
                percentValue: this.percentage ? Highcharts.numberFormat(this.percentage, 1) :'',
                seriesName: this.point ? this.point.name : "",
            }],
            count: 1,
            shared: true
        };

        if (typeof options.manageTooltipConfig === 'function') {
            json = options.manageTooltipConfig(json);
        }

        return formatTooltip(json);
    }

    let points = [];
    let shared;

    if (this.points) {
        points = this.points;
        shared = true;
    } else {
        points.push(Object.assign({}, this.point));
        shared = false;
    }

    const extendedPoint = points.find(({x}) => x === this.x);

    const pointsCount = points.length;

    json = {
        this: this,
        useCompareFrom: options.useCompareFrom,
        onlyDate: null,
        pre_lines: [],
        lines: [],
        count: pointsCount,
        shared
    };

    if (isDatetimeXAxis) {
        const items = this.points || Highcharts.splat(this);
        const highchartsScale = chart.userOptions._config.highchartsScale;

        const xDateFormat = highchartsScale ?
            tooltip.options.dateTimeLabelFormats[highchartsScale] :
            Highcharts.Tooltip.prototype.getXDateFormat.call(tooltip, items[0], tooltip.options, xAxis);

        json.onlyDate = chart.time.dateFormat(xDateFormat, this.x);
    } else if (xAxis.categories && extendedPoint) {
        json.onlyDate = String(extendedPoint.key);
    }

    if (options.scale === 'd' && isDatetimeXAxis) {
        const pointTimestamp = Number(chart.time.dateFormat('%Y%m%d', this.x));
        const region = (options.region || 'TOT').toLowerCase();

        if (region !== 'tot') {
            json.region = region;
        }

        if (ExtensionsManager.has(EXTENSION_KEY.HOLIDAYS)) {
            const HOLIDAYS = ExtensionsManager.get(EXTENSION_KEY.HOLIDAYS);

            if (HOLIDAYS.holiday[region][pointTimestamp]) {
                json.holiday = true;
                json.holidayText = HOLIDAYS.holiday[region][pointTimestamp];
            } else if (HOLIDAYS.weekend[region][pointTimestamp]) {
                json.weekend = true;
            }
        }

        json.dayOfWeek = chart.time.dateFormat('%a', this.x);
    }

    const issetComments = [];
    const issetCommentsDate = [];

    let val = 0;
    let oldVal = 0;
    let maxPrecision = 0;
    let compareIndex;
    let compareValue;
    const legendArr = [];

    const newComments = getCommentsOnLine(this, comments);
    json.xComments = newComments.xComments;

    points.forEach((point) => {
        const obj = {
            selectedSeries: point.series.index === chart.userOptions._activeSeries,
            hideSeriesName: options.highcharts && options.highcharts.tooltip && options.highcharts.tooltip.hideSeriesName,
            seriesColor: shared ? (point.point.series.color || point.point.color) : point.series.color,
            seriesName: point.series.name
        };

        // вместе с showTooltipDiff: true на вкладке Config
        if (options.useCompareFrom) {

            if (!compareIndex) {
                point.series.data.forEach((item) => {
                    if (item.category == options.useCompareFrom) {
                        compareIndex = item.index;
                    }
                });
            }

            if (compareIndex) {
                compareValue = point.series.data[compareIndex].y;
                const diff = point.y - compareValue;

                obj.diff = numberFormat(diff, 2) !== '0' ? numberFormat(diff, 2) : '';
            }

        }

        const seriesIndex = point.series.index;
        legendArr.push([seriesIndex, seriesIndex]);

        let isVal = false;
        let originvalValue;

        if (point.y || point.y === 0) {
            originvalValue = point.y;
            isVal = true;

            const precision = point.series.options && point.series.options.precision;

            if (options.isPercent) {
                obj.value = numberFormat(originvalValue, calculatePrecision(precision || 2, options));
                const isNormalize = options.normalizeDiv || options.normalizeSub;
                obj.value = obj.value + (isNormalize ? '' : ' %');
            } else {
                obj.value = numberFormat(originvalValue, calculatePrecision(precision, options));
            }

            const lastPoint = point.y.toString().split('.');
            if (lastPoint[1]) {
                maxPrecision = calculatePrecision(lastPoint[1].length, options);
            }
        }

        obj.originalValue = originvalValue;

        // TODO: проверить
        const useInSum = point.series.userOptions.useInSum == undefined ? true : point.series.userOptions.useInSum;
        if (options.enableSum && useInSum) {
            val += point.y;
        }

        // Необходимо для совместимости со старым функционалом.
        // Если нету конфига enableSum - то отрабатывает все по старому, т.е. показывается сумма для stack
        oldVal += point.y;

        if (point.series.tooltipOptions && point.series.tooltipOptions.valuePrefix) {
            obj.valuePrefix = point.series.tooltipOptions.valuePrefix;
        }

        if (point.series.tooltipOptions && point.series.tooltipOptions.valueSuffix) {
            obj.valueSuffix = point.series.tooltipOptions.valueSuffix;
        }

        // Комментарии привязываются к линии двумя способами:
        // - по `${fname}` (старый)
        // - по `${reportId}_${fname}` (новый)
        // Поэтому для поддержки обоих вариантов рассматриваются оба случая.
        if (issetComments && point.series.userOptions.fname) {
            let issetComment = issetComments[point.series.userOptions.fname];

            if (!issetComment) {
                issetComment = issetComments[point.series.userOptions.reportId + '_' + point.series.userOptions.fname];
            }

            if (issetComment) {
                obj.commentText = issetComment.text;
            }
        }

        const serieId = point.series.userOptions.id;
        if (newComments.xyComments && serieId) {
            const xyComment = newComments.xyComments[serieId];

            if (xyComment) {
                obj.xyCommentText = xyComment.text;
            }
        }

        if (point.series.options.stacking === 'percent'
            || point.percentage !== undefined && chart.userOptions._config.showPercentInTooltip
        ) {
            obj.percentValue = Highcharts.numberFormat(point.percentage, 1);
        }

        if (isVal) {
            json.pre_lines.push(obj);
        }
    });

    if (issetCommentsDate && issetCommentsDate.timestamp_ms && issetCommentsDate.timestamp_ms === this.x) {
        json.commentDateText = issetCommentsDate.text;
    }

    for (let i = 0; i < legendArr.length; i++) {
        if (json.pre_lines[i]) {
            json.lines.push(json.pre_lines[i]);
        }
    }

    // по идее то, что ниже, работает только для enableSum, т.к. в options.stacking ничего нет
    if (pointsCount > 1) {
        // TODO: options.sum?
        if (options.enableSum == null // eslint-disable-line eqeqeq, no-eq-null
            && (options.stacking === 'normal' || options.stacking === 'percent' || options.sum)) {
            json.sum = numberFormat(oldVal, maxPrecision);
        } else if (options.enableSum) {
            json.sum = numberFormat(val, maxPrecision);
        }
    }

    delete json.pre_lines;

    if (json.lines && json.lines.length > 0) {
        if (typeof options.manageTooltipConfig === 'function') {
            json = options.manageTooltipConfig(json);
        }
        return formatTooltip(json);
    } else {
        return false;
    }
}

// TODO: порефакторить
function findXVal(xAxisVal, categoriesMs) {
    let xVal, min, max, leftDiff, rightDiff;

    categoriesMs.forEach(function (val, pos) {
        if (pos > 0) {
            max = val - xAxisVal;
            min = xAxisVal - categoriesMs[pos - 1];

            if ((pos == 1 && xAxisVal < categoriesMs[pos]) || (categoriesMs[pos - 1] <= xAxisVal && categoriesMs[pos] > xAxisVal) || (pos == categoriesMs.length - 1 && xAxisVal > categoriesMs[pos])) {
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

function tooltipDiffClick(xVal, chart, options) {
    if (!xVal) {
        return;
    }

    function unCheck() {
        if (!options.useCompareFrom) {
            return false;
        }

        chart.xAxis[0].removePlotLine(options.useCompareFrom);
        options.useCompareFrom = undefined;
    }

    function check() {
        unCheck();

        const lineConfig = {
            value: xVal,
            width: 1,
            color: '#000000',
            id: xVal,
            zIndex: 20
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

function getParamsByCustomType(type = 'line', options) {
    const customType = CUSTOM_TYPES[type];
    return customType ?
        {
            chart: {
                type: customType.type
            },
            plotOptions: {
                [customType.type]: {
                    stacking: customType.stacking,
                    enableSum: options.enableSum === undefined || options.enableSum === null ? true : options.enableSum
                }
            }
        } :
        {
            chart: {
                type
            }
        };
}

/**
 * Перерисовывает числовые подписи диаграмм в шахматном порядке
 * @param chart
 */
function redrawDataLabelsInColumnChart(chart) {
    // Применяем, только если больше одного столбца в группе
    chart.series.length > 1 && chart.series.forEach(function (series, seriesIndex) {
        series.points.forEach(function (point) {
            if ((point.index + seriesIndex) % 2 === 0) {
                point.dataLabel && point.dataLabel.translate(point.dataLabel.x, point.dataLabel.y - 10);
            }
        });
    });
}

/**
 * Формирует показатель для диаграммы
 * @param {string} measure
 * @param {Object} diagram
 * @returns {string}
 */

function getDiagramMeasure(measure, diagram) {
    switch (measure) {
        case MEASURE_TYPE.ABSOLUTE:
            return Highcharts.numberFormat(diagram.y, -1);
        case MEASURE_TYPE.RELATIVE:
            return `${Highcharts.numberFormat(diagram.percentage, 1)}%`;
        default:
            return diagram.y;
    }
}

function prepareConfig(data, options, vaultId) {
    const params = merge(getParamsByCustomType(options.type, options), defaultOptions, {
        _config: options,
        chart: {
            // height: '100%',
            events: {
                load: function () {
                    manageLegend(this, options);
                    this.userOptions.isLoaded = true;
                },
                click: options.showTooltipDiff ?
                    function (event) {
                        const xVal = findXVal(event.xAxis[0].value, data.categories_ms);
                        tooltipDiffClick(xVal, this, options);
                    } :
                    undefined,
                redraw: function () {
                    drawOnlyRendererComments(this, this.userOptions._comments, this.userOptions._config);
                    manageLegend(this, options);

                    options.highcharts.chart.type === 'column' && redrawDataLabelsInColumnChart(this);
                }
            },
            spacingTop: 20,
        },
        title: {
            text: options.hideTitle ? null : options.title,
            floating: options.titleFloating
        },
        subtitle: {
            text: options.hideTitle ? null : options.subtitle
        },
        series: data.graphs || data,
        legend: options.hideLegend === true || options.showLegend === false ? {enabled: false} : buildLegend(options),
        tooltip: {
            style: {
                width: 'auto'
            },
            // поле shared для tooltip можно проставить только в одном месте (на первом уровне)
            // при sankey тип shared нужно выставлять в false, иначе тултип ведет себя некорректно:
            // * если наведено на пустую область, то показывается тултип какого-либо из полей
            // * Point.onMouseOver -> Highcharts.Pointer.runPointActions -> H.Tooltip.refresh -> Cannot read property 'series' of undefined
            shared: !options.highcharts || !options.highcharts.chart || options.highcharts.chart.type !== 'sankey'
        },
        plotOptions: {
            series: {
                events: {
                    show: function () { legendShowHide(this, 'show', vaultId); },
                    hide: function () { legendShowHide(this, 'hide', vaultId); },
                    mouseOver: function () { this.chart.userOptions._activeSeries = this.index; }
                },
                point: {
                    events: {
                        click: function (event) {
                            // удаление точки по shift + клик (в частности для трафа)
                            if (event.shiftKey) {
                                this.series.chart.tooltip.hide();
                                this.series.data[this.index].remove();
                                return true;
                            }
                            return false;
                        }
                    }
                }
            }
        },
        xAxis: {
            labels: {
                formatter: function () {
                    const axis = this.axis;
                    const highchartsScale = this.chart.userOptions._config.highchartsScale;

                    if (axis.isDatetimeAxis && highchartsScale) {
                        const dateTimeLabelFormat = axis.options.dateTimeLabelFormats[highchartsScale];
                        return this.chart.time.dateFormat(dateTimeLabelFormat.main || dateTimeLabelFormat, this.value);
                    }

                    return Highcharts.Axis.prototype.defaultLabelFormatter.call(this);
                },
                autoRotationLimit: 0,
            }
        }
    });

    if (options.highcharts.chart.type === 'column') {
        params.plotOptions.series.dataLabels = {
            crop: false,
            allowOverlap: true,
            overflow: "allow",
            style: {
                textOutline: '2px contrast',
            },
            padding: 2
        }

        params.plotOptions.column = {
            groupPadding: 0.1
        }
    }

    options.showLegendManageLine = !options.removeShowHideAll && params.series.length > COUNT_ROWS_FOR_FORCE_HIDE;

    if (options.showLegendManageLine) {
        params.series.push({
            color: '#ffffff',
            legendIndex: -10000,
            type: 'line',
            data: [],
            zIndex: 10,
            name: LEGEND_MANAGE_SERIE
        });
    }

    if (options.highcharts && options.highcharts.tooltip && options.highcharts.tooltip.formatter) {
        const formatter = options.highcharts.tooltip.formatter;
        params.tooltip.formatter = function (tooltip) {
            return `<div class="${b()}">${formatter.call(this, tooltip)}</div>`;
        };
        delete options.highcharts.tooltip.formatter;
    } else {
        params.tooltip.formatter = function (tooltip) {
            // у графиков с разными типами линий и раздельным тултипом
            const serieType = this.series && this.series.type || tooltip.chart.options.chart.type;
            if (!options.manageTooltipConfig && (
                ['scatter', 'bubble', 'sankey', 'heatmap', 'treemap', 'variwide', 'waterfall', 'pie', 'streamgraph'].includes(serieType)
                || tooltip.chart.options.chart.polar
                || this.points && this.points.some((point) => ['arearange', 'histogram', 'bellcurve', 'ohlc'].includes(point.series.type)
                // TODO: по идее можно оставить только это (+ polar?)
                // у area, column и других может быть {enableSum: true}
                || !['line', 'spline', 'area', 'column'].includes(serieType) && this.points && this.points.some((point) => point.series.tooltipOptions.pointFormat))
            )) {
                // const items = this.points || Highcharts.splat(this);
                // return `<div class="${b()}">
                //     ${tooltip.tooltipFooterHeaderFormatter(items[0])}
                //     ${tooltip.bodyFormatter(items).join('')}
                //     ${tooltip.tooltipFooterHeaderFormatter(items[0], true)}
                // </div>`;
                return `<div class="${b()}">${tooltip.defaultFormatter.call(this, tooltip).join('')}</div>`;
            }

            const {menu: {comments = [], data: {comments: dataComments = []} = {}} = {}} = vaultId ?
                ChartKit.openVault(vaultId) :
                // график показателя
                {};
            const vaultComments = comments.concat(dataComments);
            const chartComments = tooltip.chart.userOptions._comments;
            return getTooltip.call(this, tooltip, options, vaultComments.length ? vaultComments : chartComments);
        };
    }

    if (params.legend.enabled === undefined && ['pie', 'heatmap', 'treemap'].indexOf(options.type) === -1
        && ['pie', 'heatmap', 'treemap']
            .indexOf(options.highcharts && options.highcharts.chart && options.highcharts.chart.type) === -1) {
        params.legend.enabled = params.series.length > 1;
    }

    if (options && options.highcharts
        && options.highcharts.plotOptions
        && options.highcharts.plotOptions.series
        && options.highcharts.plotOptions.series.dataLabels
    ) {
        options.highcharts.plotOptions.series.dataLabels.format = undefined;
    }

    if (options && options.highcharts && options.highcharts.chart.type === 'pie') {
        options.highcharts.legend.enabled = true;
        options.highcharts.plotOptions = {...options.highcharts.plotOptions,
            pie: {
                dataLabels: {
                    format: undefined,
                    formatter: function () {
                        return `${getDiagramMeasure(MEASURE_TYPE.ABSOLUTE, this)}<br/>(${getDiagramMeasure(MEASURE_TYPE.RELATIVE, this)})`;
                    },
                    enabled: false
                }
            }
        };

        if (window.DL.exportMode) {
            options.highcharts.plotOptions.pie.dataLabels.enabled = true;
        }
    }

    // TODO: очень неправильно ориентироваться на этот параметр из Config
    // TODO: но некоторые используют stock, например, с categories
    if (options.highstock) {
        params.rangeSelector = {
            inputEnabled: false,
            enabled: false
        };

        params.useHighStock = true;

        params.navigator = {
            height: 30
        };

        buildNavigator(params.series, options);
    }

    merge(params, getTypeParams(data, options, vaultId));

    if (options.hideHolidays && !options.highstock) {
        params.xAxis.ordinal = true;
        params.xAxis.startOnTick = true;
        params.xAxis.endOnTick = true;
        params.xAxis.showFirstLabel = false;
        params.xAxis.showLastLabel = false;
    }

    // далее готовим plotOptions по типам графиков/линий
    // let getOptions = getPlotOptions(options);
    // merge(params.plotOptions[getOptions[0]], getOptions[1]);

    // if (Array.isArray(data.graphs)) {
    //     data.graphs.forEach((graph) => {
    //         if (graph.type && !params.plotOptions[graph.type]) {
    //             getOptions = getPlotOptions(options, graph.type);
    //             merge(params.plotOptions[getOptions[0]], getOptions[1]);
    //         }
    //     });
    // }

    if (Array.isArray(options.hide_series)) {
        params.series.forEach((serie) => {
            if (options.hide_series.indexOf(serie.name) !== -1) {
                serie.visible = false;
            }
        });
    }

    mergeWith(params, options.highcharts, (a, b) => {
        // на случай, если кто-то переопределяет события
        // a !== b, например, для случая yAxis.labels.formatter
        if (typeof a === 'function' && typeof b === 'function' && a !== b) {
            return function (event, ...args) {
                a.call(this, event, ...args);
                // в частности для Трафа, который по клику на чарт триггерит событие, чтобы не уйти в цикл
                if (!event || event.isTrusted !== false) {
                    return b.call(this, event, ...args);
                }
            };
        }
    });

    // https://github.com/highcharts/highcharts/issues/5671
    // http://jsfiddle.net/yo12kv0b/
    if (params.plotOptions.area && params.plotOptions.area.stacking === 'normal') {
        params.series.forEach(serie => {
            if (serie.type === undefined) {
                let hasNegativeValues = false;
                let hasPositiveValues = false;

                serie.data.forEach((value) => {
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

    // у графика из Показателя не передается vaultId
    if (vaultId) {
        // TODO: будет реализовываться на уровне состояний графика
        // TODO: не работать с индексами, т.к. линии могут добавляться/удаляться как, например, на Трафе
        // const {redraw: {hiddenSeriesIndexes}} = ChartKit.openVault(vaultId);
        //
        // if (hiddenSeriesIndexes) {
        //     hiddenSeriesIndexes.forEach((serieIndex) => {
        //         params.series[serieIndex].visible = false;
        //     });
        // } else {
        //     const newHiddenSeriesIndexes = [];
        //     params.series.forEach(({visible}, index) => {
        //         if (visible === false) {
        //             newHiddenSeriesIndexes.push(index);
        //         }
        //     });
        //     ChartKit.openVault(vaultId).store({
        //         redraw: {
        //             hiddenSeriesIndexes: newHiddenSeriesIndexes
        //         }
        //     });
        // }
    }

    return params;
}

export {buildLegend};

export default prepareConfig;
