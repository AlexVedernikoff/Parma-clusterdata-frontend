import React from 'react';
import { VisualizationControlContainerProps } from '../types';

export function VisualizationControlContainer(
  props: VisualizationControlContainerProps,
): JSX.Element {
  const { title, icon, className, children } = props;
  return (
    <div className="subcontainer">
      <div className="subheader">
        {icon && <div className="placeholder-icon">{icon}</div>}
        <span>{title}</span>
      </div>
      <div className={className}>{children}</div>
    </div>
  );
}
