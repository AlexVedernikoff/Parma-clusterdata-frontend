import { EChartsOption } from 'echarts';
import { numberValueToLocaleString } from './number-value-to-locale-string';
import { EchartsOptions } from '../../types';

export const getYAxis = (echartsOptions: EchartsOptions): EChartsOption['yAxis'] => {
  const yAxis: EChartsOption['yAxis'] = {
    axisLabel: {
      color: echartsOptions?.yAxis?.labels?.style?.color,
      formatter: (value: string | number): string => {
        if (isNaN(Number(value))) {
          return String(value);
        }

        if (typeof value === 'number') {
          if (value >= 1000000000) {
            return numberValueToLocaleString(value / 1000000000) + ' млрд';
          }
          if (value >= 1000000) {
            return numberValueToLocaleString(value / 1000000) + ' млн';
          }
          if (value >= 1000) {
            return numberValueToLocaleString(value / 1000) + ' тыс.';
          }
          return numberValueToLocaleString(value);
        }

        return value;
      },
    },
    axisLine: {
      lineStyle: { color: echartsOptions?.yAxis?.lineColor ?? '#333' },
    },
    axisTick: { show: false, lineStyle: { color: echartsOptions?.yAxis?.tickColor } },
  };

  switch (echartsOptions?.chart?.type) {
    case 'pie':
      return;
    case 'column':
    case 'line':
    default:
      return yAxis;
  }
};
