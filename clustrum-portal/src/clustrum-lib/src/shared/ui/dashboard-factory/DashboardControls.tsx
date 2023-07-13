import React from 'react';
import { ITEM_TYPE } from '../../../../../modules/constants/constants';
import { FactoryControls } from './controls/factory-controls';
import { DashboardControlsProps } from './DashboardControlsTypes';

export const DashboardControls = {
  type: ITEM_TYPE.CONTROL,
  defaultLayout: { w: 8, h: 4 },
  renderer(props: DashboardControlsProps): JSX.Element {
    return <FactoryControls {...props} />;
  },
};
