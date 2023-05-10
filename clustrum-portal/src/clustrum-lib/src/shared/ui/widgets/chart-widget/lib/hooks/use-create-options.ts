import {
  TitleComponentOption,
  AngleAxisComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
  GridComponentOption,
} from 'echarts';
import { EchartsOptions, ChartConfig } from '../../types';

import { usexAxis } from './use-x-axis';
import { useyAxis } from './use-y-axis';
import { SeriesOption, useSeries } from './use-series';
import { useTooltip } from './use-tooltip';
import { useGrid } from './use-grid';
import { useLegend } from './use-legend';
import { useTitle } from './use-title';
import { useColor } from './use-color';

interface IReturnType {
  className: string;
  option: {
    title: TitleComponentOption;
    xAxis: AngleAxisComponentOption | undefined;
    yAxis: AngleAxisComponentOption | undefined;
    series: SeriesOption[];
    grid: GridComponentOption;
    tooltip: TooltipComponentOption;
    legend: LegendComponentOption;
    color: string[];
  };
}

export const useCreateOptions = (echartsOptions: EchartsOptions, config: ChartConfig): IReturnType => {
  const xAxis = usexAxis(echartsOptions);
  const yAxis = useyAxis(echartsOptions);
  const series = useSeries(echartsOptions, config);
  const tooltip = useTooltip(echartsOptions);
  const grid = useGrid(echartsOptions);
  const legend = useLegend(echartsOptions);
  const title = useTitle(echartsOptions);
  const color = useColor(echartsOptions);

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
