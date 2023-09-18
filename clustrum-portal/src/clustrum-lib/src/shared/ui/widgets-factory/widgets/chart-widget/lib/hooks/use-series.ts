import { LineSeriesOption, PieSeriesOption, BarSeriesOption } from 'echarts';
import { useMemo } from 'react';
import {
  ChartConfig,
  EchartsOptions,
  SeriesData,
  Series,
  SeriesOption,
} from '../../types';

export const useSeries = (
  echartsOptions: EchartsOptions,
  config: ChartConfig,
): SeriesOption[] => {
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
                show: config?.plotOptions?.series?.dataLabels?.enabled,
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
                show: Boolean(config.plotOptions.diagramMagnitude),
                position: 'inner',
                formatter: (params): string => {
                  const measureType = config.plotOptions.diagramMagnitude;
                  const { percent, value } = params;
                  if (measureType === 'relative') {
                    return `${percent}%`;
                  }
                  return String(value);
                },
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
      echartsOptions.chart.type,
      echartsOptions?.plotOptions?.line?.marker?.enabled,
      echartsOptions?.plotOptions?.line?.marker?.radius,
      config,
    ],
  );
};
