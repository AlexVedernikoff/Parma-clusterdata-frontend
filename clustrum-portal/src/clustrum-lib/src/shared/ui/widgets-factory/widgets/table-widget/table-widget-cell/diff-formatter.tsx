import React from 'react';

import { Options } from '../types';
import { numberFormatter } from '../lib';

import '../table-widget.css';

export function diffFormatter(value: number, options: Options): JSX.Element {
  const diff = numberFormatter(value, options);
  if (value > 0) {
    return (
      <span className="table-widget__diff table-widget__diff--pos">&#9650;{diff}</span>
    );
  }
  if (value < 0) {
    return (
      <span className="table-widget__diff table-widget__diff--neg">&#9660;{diff}</span>
    );
  }
  return <span className="table-widget__diff">{diff}</span>;
}
