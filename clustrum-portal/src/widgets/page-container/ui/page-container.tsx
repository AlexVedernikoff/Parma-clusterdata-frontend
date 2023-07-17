import React, { ReactElement } from 'react';
import { SidePanel } from '@features/side-panel';
import { PageContainerProps } from '../types';

import './page-container.css';

export function PageContainer(props: PageContainerProps): ReactElement {
  const { withoutSidePanel, withReactRouter, children } = props;
  return (
    <div className="page-container">
      {!withoutSidePanel && <SidePanel withReactRouter={withReactRouter} />}
      <div className="page-container__content">{children}</div>
    </div>
  );
}
