import React from 'react';

// LEGACY
import DateFormat from '../../../../../../../../kamatech_modules/@kamatech-data-ui/chartkit/lib/modules/date/date-format';

import { Cell, DateType, Options } from '../types';
import { numberFormatter } from '../lib';
import { diffFormatter } from './diff-formatter';

import '../table-widget.css';

export function renderDate(date: Date, dateType: DateType): JSX.Element {
  const dateFormat = new DateFormat(date, dateType);
  if (dateFormat.isNotValidDate()) {
    return <>{date}</>;
  }
  return dateFormat.date();
}

export function renderText(cell: Cell): JSX.Element {
  if (cell.link?.href) {
    return (
      <a
        className="table-widget__link"
        href={cell.link.href}
        target={cell.link.newWindow ? '_blank' : '_self'}
        rel="noreferrer"
      >
        {cell.value}
      </a>
    );
  }

  return <>{cell.value}</>;
}

export function renderDiff(values: number[], options: Options): JSX.Element {
  const number = numberFormatter(values[0], options);
  const diff = diffFormatter(values[1], options);
  return (
    <div>
      {number} {diff}
    </div>
  );
}
