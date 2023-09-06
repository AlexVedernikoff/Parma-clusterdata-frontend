import React, { ReactElement } from 'react';
import { SidePanel } from '@features/side-panel';
import { PageContainerProps } from '../types';

import styles from './page-container.module.css';

export function PageContainer(props: PageContainerProps): ReactElement {
  const { withoutSidePanel, withReactRouter, children } = props;
  return (
    <div className={styles['page-container']}>
      {!withoutSidePanel && <SidePanel withReactRouter={withReactRouter} />}
      <div className={styles['page-container__content']}>{children}</div>
    </div>
  );
}
