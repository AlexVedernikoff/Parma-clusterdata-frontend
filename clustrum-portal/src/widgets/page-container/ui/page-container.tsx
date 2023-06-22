import React, { ReactElement } from 'react';
// eslint-disable-next-line
// @ts-ignore
import { SidePanel } from '@features/side-panel';
import { PageContainerProps } from '../types';

import './page-container.css';

export function PageContainer(props: PageContainerProps): ReactElement {
  const { withoutSidePanel, withReactRouter } = props;
  return (
    <div className="page-container">
      {!withoutSidePanel && <SidePanel withReactRouter={withReactRouter} />}
      <div className="page-container__content">{props.children}</div>
    </div>
  );
}
