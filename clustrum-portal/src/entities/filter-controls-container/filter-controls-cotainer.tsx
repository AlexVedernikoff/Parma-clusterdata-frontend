import React from 'react';
import { ITEM_TYPE } from '../../modules/constants/constants';
import { FilterFactoryControlsProps } from '@lib-shared/ui/dashboard-factory/types';
import { FilterFactoryControls } from '@lib-shared/ui/dashboard-factory';

export const filterControlsContainer = {
  type: ITEM_TYPE.CONTROL,
  defaultLayout: { w: 8, h: 4 },
  renderer(props: FilterFactoryControlsProps): JSX.Element {
    return <FilterFactoryControls {...props} />;
  },
};
