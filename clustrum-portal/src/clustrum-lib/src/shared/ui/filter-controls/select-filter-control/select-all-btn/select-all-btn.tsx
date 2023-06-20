import React from 'react';
import { Divider, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { SelectAllBtnProps } from '../types';
import './select-all-btn.css';

export function SelectAllBtn({ onClick }: SelectAllBtnProps): JSX.Element {
  return (
    <>
      <div>
        <Button
          className="select-all-btn"
          block
          icon={<CheckOutlined />}
          type="text"
          onClick={onClick}
        >
          Выбрать все
        </Button>
      </div>
      <Divider className="select-all-btn__divider" />
    </>
  );
}
