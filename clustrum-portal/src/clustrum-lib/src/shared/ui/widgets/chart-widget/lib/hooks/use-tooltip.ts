import { useMemo } from 'react';
import { TooltipComponentOption, TooltipComponentFormatterCallbackParams } from 'echarts';

import { EchartsOptions } from '../../types';

export const useTooltip = (echartsOptions: EchartsOptions): TooltipComponentOption => {
  return useMemo(() => {
    const tooltip: TooltipComponentOption = {
      show: true,
      borderWidth: 0,
      padding: 10,
      appendToBody: echartsOptions?.tooltip?.outside ?? true,
    };
    switch (echartsOptions?.chart?.type) {
      case 'pie':
        tooltip.trigger = 'item';
        tooltip.position = 'inside';
        tooltip.formatter = (params: TooltipComponentFormatterCallbackParams): string => {
          const { percent, value, name } = Array.isArray(params) ? params[0] : params;
          return `${percent}% ${value} ${name}`;
        };
        tooltip.textStyle = { color: '#FFF' };
        tooltip.backgroundColor = '#000';
        return tooltip;
      case 'column':
      case 'line':
      default:
        tooltip.trigger = 'axis';
        tooltip.axisPointer = { type: 'none' };
        return tooltip;
    }
  }, [echartsOptions?.tooltip?.outside, echartsOptions?.chart?.type]);
};
