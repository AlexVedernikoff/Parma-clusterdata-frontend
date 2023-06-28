import { ChartType } from './chart-type';

export interface ChartConfig {
  highcharts: {
    chart: {
      type: ChartType;
    };
    legend: object;
    xAxis: {
      endOnTick: boolean;
    };
    yAxis: {
      endOnTick: boolean;
    };
    tooltip: object;
    plotOptions?: {
      series?: {
        dataLabels?: {
          enabled?: boolean;
        };
      };
    };
  };
  withoutLineLimit: boolean;
  removeShowHideAll: boolean;
  hideComments: boolean;
  hideHolidays: boolean;
  normalizeDiv: boolean;
  normalizeSub: boolean;
  isPercent: boolean;
}
