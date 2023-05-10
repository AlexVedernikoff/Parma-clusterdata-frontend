import React, { FC, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

import { getEchartsConfig as getConfig } from './lib/helpers';
import { useCreateOptions } from './lib/hooks/use-create-options';
import { ChartConfig } from './types';
import './style.css';
import { clickHouseDateFormat } from './lib/helpers';

const FILTER_CONDITION_TYPE = {
  IS_NULL: '__is_null',
};

type Props = {
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
  onChange<T>(param: T): void;
  onStateAndParamsChange<T>(param: T): void;
};

export const ChartWidget: FC<Props> = props => {
  const data = props.data.data;
  const conf = props.data.config;
  const libraryConfig = props.data.libraryConfig;
  const { config: highchartsOptions } = getConfig(Object.assign({ highcharts: libraryConfig }, conf), data, null, null);
  const config = props?.data?.libraryConfig;
  const { option, className } = useCreateOptions(highchartsOptions, config);

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

  const onChange = <T extends { point: { originalCategory: string } }>(data: T): void => {
    const groupField = props.data.data.groupField;
    if (groupField) {
      props.onStateAndParamsChange({
        params: {
          [groupField]: convertCategoryName(data.point.originalCategory, props.data.data.categoriesDataTypeName),
        },
      });
    }
  };

  const onEvents = {
    click: <T extends { name: string }>(params: T): void => {
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
};

ChartWidget.displayName = 'ChartWidget';
