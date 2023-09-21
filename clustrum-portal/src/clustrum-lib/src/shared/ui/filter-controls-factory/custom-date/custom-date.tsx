import { Dayjs } from 'dayjs';
import React from 'react';

export const renderCustomDate = (current: Dayjs): JSX.Element => {
  const styles = { width: 35.99 };
  return (
    <td title={current.format('DD.MM.YYYY')} className="ant-picker-cell" style={styles}>
      {current.date()}
    </td>
  );
};
