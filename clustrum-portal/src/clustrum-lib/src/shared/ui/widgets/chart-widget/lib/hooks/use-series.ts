import { LineSeriesOption, PieSeriesOption, BarSeriesOption } from 'echarts';
import { useMemo } from 'react';
import { ChartConfig, EchartsOptions } from '../../types';

export type SeriesOption = BarSeriesOption | PieSeriesOption | LineSeriesOption;

interface ISeriesData {
  y: string | number;
  label?: string | number;
  originalCategory: string;
  name?: string;
  valueWithFormat?: number;
}

interface ISeries {
  title: string;
  data: ISeriesData[];
  legendTitle: string;
  colorValue: null;
  color: string;
  stack: null;
  name: string;
}

export const useSeries = (echartsOptions: EchartsOptions, config: ChartConfig): SeriesOption[] => {
  return useMemo(
    () =>
      echartsOptions?.series?.map(({ data, color, name }: ISeries) => {
        if (echartsOptions.chart.type === 'column') {
          const series: BarSeriesOption = {
            data: data.map(({ y }: ISeriesData) => y),
            type: 'bar',
            name,
            label: {
              show: config?.highcharts?.plotOptions?.series?.dataLabels?.enabled,
              position: 'top',
              fontWeight: 700,
            },
            itemStyle: { color },
          };

          return series;
        }

        if (echartsOptions.chart.type === 'pie') {
          const series: PieSeriesOption = {
            data: data.map(({ y, name }: ISeriesData) => ({ value: y as number, name })),
            type: 'pie',
            name,
            radius: ['40%', '70%'],
            emphasis: {
              scale: false,
            },
            labelLine: {
              show: false,
            },
            label: {
              show: false,
            },
          };

          return series;
        }

        if (echartsOptions.chart.type === 'line') {
          const series: LineSeriesOption = {
            data: data.map(({ y }: ISeriesData) => y),
            type: 'line',
            showSymbol: echartsOptions?.plotOptions?.line?.marker?.enabled,
            symbol: 'circle',
            symbolSize: (echartsOptions?.plotOptions?.line?.marker?.radius ?? 1) * 2,
            name,
            lineStyle: { color },
            itemStyle: { color },
          };

          return series;
        }

        const series = {
          data: data.map(({ y }: ISeriesData) => y),
          type: echartsOptions?.chart?.type ?? 'line',
          showSymbol: echartsOptions?.plotOptions?.line?.marker?.enabled,
          symbol: 'circle',
          symbolSize: (echartsOptions?.plotOptions?.line?.marker?.radius ?? 1) * 2,
          name,
        };

        return series;

        // switch (echartsOptions.chart.type) {
        //   case 'column':
        //     series.type = 'bar';
        //     series.label = {
        //       show: config?.highcharts?.plotOptions?.series?.dataLabels?.enabled,
        //       position: 'top',
        //       fontWeight: 700,
        //     };
        //     series.itemStyle = { color };
        //     return series;
        //   case 'pie':
        //     series.radius = ['40%', '70%'];
        //     series.emphasis = {
        //       scale: false,
        //     };
        //     series.labelLine = {
        //       show: false,
        //     };
        //     series.label = {
        //       show: false,
        //     };
        //     series.data = data.map(({ y, name }: ISeriesData) => ({ value: y, name }));
        //     return series;
        //   case 'line':
        //     series.lineStyle = { color };
        //     series.itemStyle = { color };
        //     return series;
        //   default:
        //     return series;
        // }
      }),
    [
      echartsOptions?.series,
      echartsOptions?.chart?.type,
      echartsOptions?.plotOptions?.line?.marker?.enabled,
      echartsOptions?.plotOptions?.line?.marker?.radius,
      config?.highcharts?.plotOptions?.series?.dataLabels?.enabled,
    ],
  );
};
