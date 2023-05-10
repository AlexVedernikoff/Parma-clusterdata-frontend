import { GridComponentOption } from 'echarts';

import { EchartsOptions } from '../../types';

export const useGrid = (echartsOptions: EchartsOptions): GridComponentOption => ({
  left: echartsOptions.chart.spacingLeft ?? 10,
  right: 15,
  containLabel: true,
  top: echartsOptions?.chart?.spacingTop ?? 10,
  bottom: 35,
  backgroundColor: echartsOptions?.chart?.backgroundColor ?? 'transparent',
});
