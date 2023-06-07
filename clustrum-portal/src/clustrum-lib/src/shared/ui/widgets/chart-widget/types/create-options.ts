import {
  TitleComponentOption,
  AngleAxisComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
  GridComponentOption,
} from 'echarts';

import { SeriesOption } from '../lib/hooks/use-series';

export interface CreateOptionsReturnType {
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
