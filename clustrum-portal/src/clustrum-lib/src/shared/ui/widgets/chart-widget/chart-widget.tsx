import React, { useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

import { getEchartsConfig } from './lib/helpers';
import { useCreateOptions } from './lib/hooks/use-create-options';
import { ChartConfig } from './types';
import { clickHouseDateFormat } from './lib/helpers';

const FILTER_CONDITION_TYPE = {
  IS_NULL: '__is_null',
};

interface ChartWidgetProps {
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

export function ChartWidget(props: ChartWidgetProps): JSX.Element {
  const { data: propsData } = props;
  const data = propsData.data;
  const conf = propsData.config;
  const libraryConfig = propsData.libraryConfig;
  const { config: graphOptions } = getEchartsConfig(
    Object.assign({ echart: libraryConfig }, conf),
    data,
    null,
    null,
  );
  const { option, className } = useCreateOptions(graphOptions, libraryConfig);

  function convertCategoryName(category: string, categoriesDataTypeName: string): string {
    if (category === null) {
      return FILTER_CONDITION_TYPE.IS_NULL;
    }

    switch (categoriesDataTypeName) {
      case 'date':
      case 'datetime':
        return clickHouseDateFormat(category, categoriesDataTypeName);

      default:
        return category;
    }
  }

  interface DataProps {
    point: {
      originalCategory: string;
    };
  }

  const onChange = (data: DataProps): void => {
    const groupField = propsData.data.groupField;
    const originalCategory = data.point.originalCategory;
    if (groupField) {
      props.onStateAndParamsChange({
        params: {
          [groupField]: convertCategoryName(
            originalCategory,
            propsData.data.categoriesDataTypeName,
          ),
        },
      });
    }
  };

  const onEvents = {
    click: (params: { name: string }): void => {
      onChange({
        point: { originalCategory: params.name },
      });
    },
  };

  useEffect(() => {
    props.onLoad();
  }, [props]);

  return (
    <ReactECharts
      className={className}
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'svg' }}
      notMerge={true}
      onEvents={onEvents}
    />
  );
}
