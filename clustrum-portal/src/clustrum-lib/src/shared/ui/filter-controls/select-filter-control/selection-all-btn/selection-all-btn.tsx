import React from 'react';
import { Divider, Button } from 'antd';
import { SelectionAllBtnProps } from '../types';
import './selection-all-btn.css';

export function SelectionAllBtn(props: SelectionAllBtnProps): JSX.Element {
  const { onClick, label, icon } = props;
  return (
    <>
      <Button
        className="selection-all-btn"
        block
        icon={icon}
        type="text"
        onClick={onClick}
      >
        {label}
      </Button>
      <Divider className="selection-all-btn__divider" />
    </>
  );
}
