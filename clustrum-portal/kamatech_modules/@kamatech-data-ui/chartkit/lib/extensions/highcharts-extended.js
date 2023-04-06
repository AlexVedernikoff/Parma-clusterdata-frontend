import Highcharts from 'highcharts';

import highchartsMore from 'highcharts/highcharts-more';

import stock from 'highcharts/modules/stock';

import solidGauge from 'highcharts/modules/solid-gauge';
import funnel from 'highcharts/modules/funnel';
import histogramBellcurve from 'highcharts/modules/histogram-bellcurve';
import sankey from 'highcharts/modules/sankey';
import heatmap from 'highcharts/modules/heatmap';
import treemap from 'highcharts/modules/treemap';
import variwide from 'highcharts/modules/variwide';
import streamgraph from 'highcharts/modules/streamgraph';
import drilldown from 'highcharts/modules/drilldown';
import parallelCoordinates from 'highcharts/modules/parallel-coordinates';

import annotations from 'highcharts/modules/annotations';
import seriesLabel from 'highcharts/modules/series-label';

import indicators from 'highcharts/indicators/indicators';
import ema from 'highcharts/indicators/ema';

function extendHighcharts() {
  highchartsMore(Highcharts);

  stock(Highcharts);

  solidGauge(Highcharts);
  funnel(Highcharts);
  histogramBellcurve(Highcharts);
  sankey(Highcharts);
  heatmap(Highcharts);
  treemap(Highcharts);
  variwide(Highcharts);
  streamgraph(Highcharts);
  drilldown(Highcharts);

  annotations(Highcharts);
  seriesLabel(Highcharts);
  parallelCoordinates(Highcharts);

  indicators(Highcharts);
  ema(Highcharts);
}

export default extendHighcharts;
