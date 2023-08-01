import { EChartsOption } from 'echarts';
import { EchartsOptions } from '../../types';

const PADDING = 40;

export const getXAxis = (
  echartsOptions: EchartsOptions,
  refWidget: React.RefObject<HTMLDivElement>,
): EChartsOption['xAxis'] => {
  const wrapper = (refWidget.current?.getBoundingClientRect().width as number) - PADDING;
  const calculateWidth = wrapper / echartsOptions?.xAxis?.categories.length;

  const xAxis: EChartsOption['xAxis'] = {
    data: echartsOptions?.xAxis?.categories ?? [],
    axisTick: { show: false, lineStyle: { color: echartsOptions?.xAxis?.tickColor } },
    axisLine: {
      lineStyle: { color: echartsOptions?.xAxis?.lineColor ?? '#333' },
    },
    axisLabel: {
      color: echartsOptions?.xAxis?.labels?.style?.color,
      interval: 0,
      hideOverlap: false,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore в документации свойство есть, а в интерфейсе нет
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
