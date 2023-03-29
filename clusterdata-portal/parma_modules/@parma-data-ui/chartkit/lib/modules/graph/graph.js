import ChartKit from '../../components/ChartKit/ChartKit';
import { drawComments } from '../comments/drawing';

import prepareData from './data/data';
import prepareConfig from './config/config';

import initHighchart from '../highcharts/highcharts';

// import './graph.scss';

export default function getGraph(options, data, vaultId, comments) {
  initHighchart();

  prepareData(data, options);

  return {
    // TODO: подумать над тем, как правильнее мержить комментарии, может стоит это делать сразу после api/run
    // TODO: чтобы подавать в отрисовку готовые данные
    config: Object.assign({
      _comments: [...(comments || []), ...(data.comments || [])],
      ...prepareConfig(data, options, vaultId),
    }),
    callback: chart => {
      chart.series.forEach(serie => {
        if (['line', 'spline', 'area', 'stack'].includes(serie.type) && !serie.options.connectNulls) {
          const { data } = serie;
          data.forEach((point, index) => {
            // рисуем маркер, если есть текущее значение, но нет следующего и предыдущего
            if (
              point.y !== null &&
              // аналог index === 0, но для случаев, когда заполнение массива идет не с 0
              (data[index - 1] === undefined ||
                // eslint-disable-next-line eqeqeq, no-eq-null
                data[index - 1].y == null) &&
              // eslint-disable-next-line eqeqeq, no-eq-null
              (index === data.length - 1 || data[index + 1].y == null)
            ) {
              point.update({ marker: { enabled: true } });
            }
          });
        }
      });

      if (options.highstock) {
        let extmin;
        let extmax;

        if (options.extremes && options.extremes.min && options.extremes.max) {
          extmin = options.extremes.min;
          extmax = options.extremes.max;
        } else {
          if (options.highstock.range_min && options.highstock.range_max) {
            extmin = parseInt(options.highstock.override_range_min || options.highstock.range_min, 10);
            extmax = parseInt(options.highstock.override_range_max || options.highstock.range_max, 10);
          }

          // if (options.redrawState && options.redrawState.highstock) {
          //     extmin = options.redrawState.highstock.highstockStart;
          //     extmax = options.redrawState.highstock.highstockEnd;
          // }
        }

        if (extmin < options.xmin) {
          extmin = options.xmin;
        }
        if (extmax > options.xmax) {
          extmax = options.xmax;
        }

        if (extmin && extmax) {
          chart.xAxis[0].setExtremes(extmin, extmax);
        }

        options.highstock.range_min = '';
        options.highstock.range_max = '';
      }

      // у графика метрики нет vaultId
      if (vaultId) {
        ChartKit.openVault(vaultId).store({ chart });
        const {
          menu: { comments, data },
        } = ChartKit.openVault(vaultId);
        if (comments || data.comments) {
          drawComments(chart, (comments || []).concat(data.comments || []), options);
        }
      }

      if (chart && chart.userOptions._comments) {
        drawComments(chart, chart.userOptions._comments, chart.userOptions._config);
      }
    },
  };
}
