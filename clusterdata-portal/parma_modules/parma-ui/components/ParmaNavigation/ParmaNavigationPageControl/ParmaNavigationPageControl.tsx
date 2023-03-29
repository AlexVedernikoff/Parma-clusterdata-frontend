import * as React from 'react';
import { ParmaNavigationPageControlInterface } from './ParmaNavigationPageControl.interface';
import './ParmaNavigationPageControl.css';
import GoToPage from './GoToPage/GoToPage';
import PageNumbers from './PageNumbers/PageNumbers';
import { NumberValueHelper } from '../../../helpers';

export const ParmaNavigationPageControl = ({
  page,
  pageSize,
  rowsCount,
  dataLength,
  onClick,
  onStateAndParamsChange,
}: ParmaNavigationPageControlInterface) => {
  let viewPage: number = page + 1;

  const handleChangePage = (viewPage: number, viewPageSize = pageSize) => {
    // Обработка клика в дашборде
    if (onStateAndParamsChange) {
      onStateAndParamsChange({ page: viewPage - 1, pageSize: viewPageSize });
    }
    // Обработка клика в виджете
    else if (onClick) {
      onClick(viewPage - 1, viewPageSize);
    }
  };

  const endRows = page * pageSize + dataLength;
  const isPageBackDisabled = page == 0;
  const isPageForwardDisabled = endRows >= rowsCount;
  const totalPageCount = Math.ceil(rowsCount / pageSize);

  return (
    <div className="pagination">
      <div className="pagination__total">
        <span className="pagination__total-label">Всего:</span>
        <span className="pagination__total-count">{NumberValueHelper.toLocaleString(rowsCount)}</span>
      </div>

      <GoToPage
        goTo={(pageNumber: number) => {
          const isValidNumber = !isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPageCount;
          if (isValidNumber) {
            handleChangePage(pageNumber);
          }
        }}
        disabled={totalPageCount === 1}
      />

      <div
        className={`pagination__page-back ${isPageBackDisabled ? 'pagination__page-back_disabled' : ''}`}
        onClick={() => !isPageBackDisabled && handleChangePage(viewPage - 1)}
      >
        &lt;
      </div>

      <PageNumbers currentPage={viewPage} totalPageCount={totalPageCount} />

      <div
        className={`pagination__page-forward ${isPageForwardDisabled ? 'pagination__page-forward_disabled' : ''}`}
        onClick={() => !isPageForwardDisabled && handleChangePage(viewPage + 1)}
      >
        &gt;
      </div>
    </div>
  );
};
