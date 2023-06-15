import React, { ReactElement } from 'react';
// eslint-disable-next-line
// @ts-ignore
import { SidePanel } from '@features/side-panel';
import './page-container.css';

interface PageContainerProps {
  withoutSidePanel?: boolean;
  withReactRouter?: boolean;
  children?: ReactElement;
}

export function PageContainer(props: PageContainerProps): ReactElement {
  const { withoutSidePanel, withReactRouter } = props;
  return (
    <div className="page-container">
      {!withoutSidePanel && <SidePanel withReactRouter={withReactRouter} />}
      <div className="page-container__content">{props.children}</div>
    </div>
  );
}
