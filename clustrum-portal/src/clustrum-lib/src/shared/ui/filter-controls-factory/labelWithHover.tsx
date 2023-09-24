import { Popover } from 'antd';
import React from 'react';
import styles from './filter-controls-factory.module.css';
import { LabelWithHoverProps } from './types/filter-factory-controls-props';

export function LabelWithHover({ label }: LabelWithHoverProps): JSX.Element {
  return (
    <Popover
      placement="bottom"
      content={
        <div className={styles['filter-controls-factory__labelContainer_hint']}>
          {label}
        </div>
      }
      overlayInnerStyle={{
        background: 'transparent',
        boxShadow: 'none',
      }}
    >
      <div
        className={styles['filter-controls-factory__labelContainer']}
      >{`${label}:`}</div>
    </Popover>
  );
}
