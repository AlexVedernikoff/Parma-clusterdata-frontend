import { Dayjs } from 'dayjs';
import React from 'react';

export const renderCustomDate = (format: string): ((current: Dayjs) => JSX.Element) => {
  const newCell = (current: Dayjs): JSX.Element => {
    const styles = { width: 35.99 };
    return (
      <td title={current.format(format)} className="ant-picker-cell" style={styles}>
        {current.date()}
      </td>
    );
  };
  return newCell;
};
