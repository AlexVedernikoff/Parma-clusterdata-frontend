import { ChartConfig } from './chart-config';

export interface ChartWidgetProps {
  data: {
    data: {
      categoriesDataTypeName: string;
      groupField: string;
    };
    config: {
      hideComments: boolean;
      hideHolidays: boolean;
      manageTooltipConfig(): void;
      normalizeDiv: boolean;
      normalizeSub: boolean;
      removeShowHideAll: boolean;
      withoutLineLimit: boolean;
    };
    libraryConfig: ChartConfig;
  };
  onLoad(): void;
  onChange(param: { name: string }): void;
  onStateAndParamsChange(params: { [key: string]: unknown }): void;
}
