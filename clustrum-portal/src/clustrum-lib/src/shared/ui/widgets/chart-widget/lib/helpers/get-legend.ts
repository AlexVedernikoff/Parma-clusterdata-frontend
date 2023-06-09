import { LegendComponentOption } from 'echarts';
import { EchartsOptions } from '../../types';

export const getLegend = (echartsOptions: EchartsOptions): LegendComponentOption => {
  const legend: LegendComponentOption = {
    show: echartsOptions?.legend?.enabled ?? false,
    bottom: '5',
    itemWidth: 14,
    itemGap: echartsOptions?.legend?.itemDistance ?? 10,
    tooltip: {
      show: true,
      position: 'top',
      padding: 5,
      confine: true,
    },
    textStyle: {
      overflow: 'truncate',
      width: 400,
    },
    inactiveColor: '#ccc',
    padding: echartsOptions?.legend?.margin ?? 5,
    itemHeight: 2,
  };

  switch (echartsOptions?.chart?.type) {
    case 'pie':
    case 'column':
      legend.itemWidth = 14;
      legend.itemHeight = 14;
      legend.icon = 'circle';
      return legend;
    case 'line':
    default:
      return legend;
  }
};
