import React, { ReactElement } from 'react';
import { SidePanel } from '../../../features/side-panel/ui/side-panel';
import './page-container.css';

interface PageContainerProps {
  withoutSidePanel?: boolean;
  withoutReactRouter?: boolean;
  children?: ReactElement;
}

export function PageContainer(props: PageContainerProps): ReactElement {
  const { withoutSidePanel, withoutReactRouter } = props;
  return (
    <div className="page-container">
      {!withoutSidePanel && <SidePanel withoutReactRouter={withoutReactRouter} />}
      <div className="page-container__content">{props.children}</div>
    </div>
  );
}
