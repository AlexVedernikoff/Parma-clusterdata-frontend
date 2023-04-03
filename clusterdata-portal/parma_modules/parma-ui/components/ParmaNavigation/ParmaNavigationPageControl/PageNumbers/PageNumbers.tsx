import React from 'react';
import './PageNumbers.css';
import { NumberValueHelper } from '../../../../helpers';

type Props = {
  currentPage: number;
  totalPageCount: number;
};

export default function PageNumbers({ currentPage, totalPageCount }: Props) {
  return (
    <div className="pagination__page-numbers">
      <span className="pagination__page-numbers-current">{NumberValueHelper.toLocaleString(currentPage)}</span>
      из
      <span className="pagination__page-numbers-total">{NumberValueHelper.toLocaleString(totalPageCount)}</span>
    </div>
  );
}
