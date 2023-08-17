import { EchartsOptions, ChartConfig, CreateOptionsReturnType } from '../../types';

import { getXAxis } from '../helpers/get-x-axis';
import { getYAxis } from '../helpers/get-y-axis';
import { useSeries } from './use-series';
import { useTooltip } from './use-tooltip';
import { getGrid } from '../helpers/get-grid';
import { getLegend } from '../helpers/get-legend';
import { getTitle } from '../helpers/get-title';
import { getColor } from '../helpers/get-color';

export const useCreateOptions = (
  echartsOptions: EchartsOptions,
  config: ChartConfig,
  refWidget: React.RefObject<HTMLDivElement>,
): CreateOptionsReturnType => {
  const xAxis = getXAxis(echartsOptions, refWidget);
  const yAxis = getYAxis(echartsOptions);
  const series = useSeries(echartsOptions, config);
  const tooltip = useTooltip(echartsOptions);
  const grid = getGrid(echartsOptions);
  const legend = getLegend(echartsOptions);
  const title = getTitle(echartsOptions);
  const color = getColor(echartsOptions);

  return {
    className: echartsOptions?.chart?.className ?? '',
    option: {
      title,
      xAxis,
      yAxis,
      series,
      grid,
      tooltip,
      legend,
      color,
    },
  };
};
