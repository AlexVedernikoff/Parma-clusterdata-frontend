import React, { FC } from 'react';
import { SidePanel } from '../../../../../features/side-panel/side-panel';

export const PageContainer: FC = props => {
  return (
    <>
      <SidePanel />
      {props.children}
    </>
  );
};
