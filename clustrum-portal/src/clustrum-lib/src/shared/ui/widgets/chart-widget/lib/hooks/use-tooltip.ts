import { useMemo } from 'react';
import { TooltipComponentOption } from 'echarts';

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
