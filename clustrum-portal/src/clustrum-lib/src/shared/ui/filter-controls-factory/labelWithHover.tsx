import React, { useState } from 'react';
import styles from './filter-controls-factory.module.css';
import { LabelWithHoverProps } from './types/filter-factory-controls-props';

export function LabelWithHover({ label }: LabelWithHoverProps): JSX.Element {
  const [isHover, setIsHover] = useState(false);
  const mouseEnter = (): void => {
    setIsHover(true);
  };
  const mouseLeave = (): void => {
    setIsHover(false);
  };
  return (
    <div onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
      <div
        className={styles['filter-controls-factory__labelContainer']}
      >{`${label}:`}</div>
      {isHover && (
        <div className={styles['filter-controls-factory__labelContainer_hint']}>
          {label}
        </div>
      )}
    </div>
  );
}
