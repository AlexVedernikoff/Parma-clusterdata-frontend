import {
  TitleComponentOption,
  AngleAxisComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
  GridComponentOption,
} from 'echarts';
import { SeriesOption } from './series-option';

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
