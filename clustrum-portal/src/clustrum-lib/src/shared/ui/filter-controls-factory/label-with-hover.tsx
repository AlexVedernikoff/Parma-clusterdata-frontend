import { Popover } from 'antd';
import React from 'react';
import styles from './filter-controls-factory.module.css';
import { LabelWithHoverProps } from './types';

export function LabelWithHover(props: LabelWithHoverProps): JSX.Element {
  const { label } = props;
  return (
    <Popover
      placement="bottom"
      content={
        <div className={styles['filter-controls-factory__label-сontainer-hint']}>
          {label}
        </div>
      }
      overlayInnerStyle={{
        background: 'transparent',
        boxShadow: 'none',
      }}
    >
      <div
        className={styles['filter-controls-factory__label-сontainer']}
      >{`${label}:`}</div>
    </Popover>
  );
}
