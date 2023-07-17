import { ChartType } from './chart-type';
import { DiagramMagnitude } from './diagram-magnitude';

export interface ChartConfig {
  chart: {
    type: ChartType;
  };
  legend: object;
  xAxis: {
    endOnTick: boolean;
  };
  yAxis: {
    endOnTick: boolean;
  };
  tooltip: object;
  plotOptions: {
    diagramMagnitude?: DiagramMagnitude;
    series?: {
      dataLabels?: {
        enabled?: boolean;
      };
    };
  };
}
