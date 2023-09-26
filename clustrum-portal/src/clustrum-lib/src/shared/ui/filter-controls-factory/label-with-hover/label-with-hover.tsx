import { Popover } from 'antd';
import React from 'react';
import styles from './label-with-hover.module.css';
import { LabelWithHoverProps } from './types';

export function LabelWithHover(props: LabelWithHoverProps): JSX.Element {
  const { label } = props;
  return (
    <Popover placement="bottom" content={<span>{label}</span>}>
      <div className={styles['label-with-hover']}>{`${label}:`}</div>
    </Popover>
  );
}
