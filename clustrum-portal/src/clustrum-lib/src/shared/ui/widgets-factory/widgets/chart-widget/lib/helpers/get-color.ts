import { EchartsOptions } from '../../types';

export const getColor = (echartsOptions: EchartsOptions): string[] => {
  switch (echartsOptions?.chart?.type) {
    case 'pie':
      return echartsOptions?.plotOptions?.pie?.colors ?? [];
    default:
      return [];
  }
};
