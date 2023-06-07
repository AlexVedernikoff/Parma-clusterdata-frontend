import { TitleComponentOption } from 'echarts';

import { EchartsOptions } from '../../types';

export const getTitle = (echartsOptions: EchartsOptions): TitleComponentOption => ({
  text: echartsOptions?.title?.text ?? '',
  textStyle: {
    color: echartsOptions?.title?.style?.color ?? '#333',
  },
  left: 'center',
  subtext: echartsOptions?.subtitle?.text ?? '',
});
