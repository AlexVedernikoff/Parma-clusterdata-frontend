import { Dayjs } from 'dayjs';
import React from 'react';

const ANT_RANGE_DEFAULT_TD_WIDTH = 35.99;

export const renderCustomDate = (format: string): ((current: Dayjs) => JSX.Element) => {
  const newCell = (current: Dayjs): JSX.Element => {
    const styles = { width: ANT_RANGE_DEFAULT_TD_WIDTH };
    return (
      <div
        title={current.format(format)}
        className="ant-picker-cell-inner"
        style={styles}
      >
        {current.date()}
      </div>
    );
  };
  return newCell;
};
