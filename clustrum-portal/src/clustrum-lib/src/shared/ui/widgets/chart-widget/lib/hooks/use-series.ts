import { LineSeriesOption, PieSeriesOption, BarSeriesOption } from 'echarts';
import { useMemo } from 'react';
import { ChartConfig, EchartsOptions, SeriesData, Series } from '../../types';

export type SeriesOption = BarSeriesOption | PieSeriesOption | LineSeriesOption;

export const useSeries = (echartsOptions: EchartsOptions, config: ChartConfig): SeriesOption[] => {
  return useMemo(
    () =>
      echartsOptions?.series?.map(({ data, color, name }: Series) => {
        switch (echartsOptions.chart.type) {
          case 'column': {
            const series: BarSeriesOption = {
              data: data.map(({ y }: SeriesData) => y),
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

          case 'pie': {
            const series: PieSeriesOption = {
              data: data.map(({ y, name }: SeriesData) => ({ value: y as number, name })),
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

          default: {
            const series: LineSeriesOption = {
              data: data.map(({ y }: SeriesData) => y),
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
        }
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
