import React from 'react';

import { Options } from '../types';
import { numberFormatter } from '../lib';

export function diffFormatter(value: number, options: Options): JSX.Element {
  const diff = numberFormatter(value, options);
  if (value > 0) {
    return (
      <span className="chartkit-table__diff chartkit-table__diff_pos">&#9650;{diff}</span>
    );
  }
  if (value < 0) {
    return (
      <span className="chartkit-table__diff chartkit-table__diff_neg">&#9660;{diff}</span>
    );
  }
  return <span className="chartkit-table__diff">{diff}</span>;
}
