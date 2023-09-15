import React from 'react';
import { VisualizationControlContainerProps } from '../../types';
import styles from './visualization-control-container.module.css';

export function VisualizationControlContainer(
  props: VisualizationControlContainerProps,
): JSX.Element {
  const { title, icon, className, children } = props;
  return (
    <div className={styles['subcontainer']}>
      <div className={styles['subcontainer__subheader']}>
        {icon && <div className={styles['subcontainer__placeholder-icon']}>{icon}</div>}
        <span>{title}</span>
      </div>
      <div className={className}>{children}</div>
    </div>
  );
}
