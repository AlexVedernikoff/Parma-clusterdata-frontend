import { AngleAxisComponentOption } from 'echarts';
import { EchartsOptions } from '../../types';

const PADDING = 40;

export const getXAxis = (
  echartsOptions: EchartsOptions,
): AngleAxisComponentOption | undefined => {
  const wrapper =
    (document.querySelector('.chartkit__widget')?.getBoundingClientRect()
      .width as number) - PADDING;

  const calculateWidth = wrapper / echartsOptions?.xAxis?.categories.length;

  const xAxis = {
    data: echartsOptions?.xAxis?.categories ?? [],
    axisTick: { show: false, lineStyle: { color: echartsOptions?.xAxis?.tickColor } },
    axisLine: {
      lineStyle: { color: echartsOptions?.xAxis?.lineColor ?? '#333' },
    },
    axisLabel: {
      color: echartsOptions?.xAxis?.labels?.style?.color,
      interval: 0,
      hideOverlap: false,
      overflow: 'truncate',
      width: calculateWidth,
    },
  };

  switch (echartsOptions?.chart?.type) {
    case 'pie':
      return;
    case 'column':
    case 'line':
    default:
      return xAxis;
  }
};
