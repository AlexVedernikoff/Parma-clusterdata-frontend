import React from 'react';
import { Divider, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { SelectionAllBtnProps } from '../types';
import './selection-all-btn.css';

export function SelectionAllBtn(props: SelectionAllBtnProps): JSX.Element {
  const { allValues, showClearButton, onClick } = props;

  const label = showClearButton ? 'Очистить' : 'Выбрать все';
  const icon = showClearButton ? undefined : <CheckOutlined />;

  const handleClick = (): void => onClick(showClearButton ? [] : allValues);

  return (
    <>
      <Button
        className="selection-all-btn"
        block
        icon={icon}
        type="text"
        onClick={handleClick}
      >
        {label}
      </Button>
      <Divider className="selection-all-btn__divider" />
    </>
  );
}
