import React, { useEffect, useState } from 'react';
import { Table, TablePaginationConfig, Tooltip } from 'antd';
import {
  TableWidgetProps,
  isExtendedColumnType,
  AntdSortingOrder,
  SortingMapDataItem,
  SortingMaps,
  SortingMap,
  AntdSortingOrderKey,
} from './types';
// TODO: вынести эту бизнес логику за пределы shared слоя
import { selectNeedUniqueRows } from '../../../../../../../reducers/visualization';
import './table-widget.css';
import { useSelector } from 'react-redux';
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from 'antd/es/table/interface';
import { FIRST_PAGE_INDEX, INITIAL_SORTING_MAPS_STATE } from './lib/constants';
import { SortingOrder } from '@lib-shared/types';

export function TableWidget(props: TableWidgetProps): JSX.Element {
  const {
    columns,
    dataSource,
    title,
    totalRowsCount,
    paginateInfo: { page: initPage },
    onPageControlClicker,
    onStateAndParamsChange,
    onOrderByClickInWizard,
  } = props;

  const [antdPage, setAntdPage] = useState(initPage);
  const [page, setPage] = useState(antdPage);
  const [pageSize, setPageSize] = useState(10);
  const isNeedUniqueRows = useSelector(state => selectNeedUniqueRows(state));

  useEffect(() => {
    // TODO: Зачем этот код?
    setAntdPage(FIRST_PAGE_INDEX);

    if (isNeedUniqueRows) {
      setAntdPage(FIRST_PAGE_INDEX);
    }
  }, [pageSize, isNeedUniqueRows]);
  const [sortingMaps, setSortingMaps] = useState<SortingMaps>(INITIAL_SORTING_MAPS_STATE);

  // TODO: вынести эту бизнес логику за пределы shared слоя
  // TODO: вынести описание типа state за пределы shared слоя
  const sortingMapData = useSelector(
    (state: { visualization: { sort?: SortingMapDataItem[] } }) =>
      state.visualization?.sort,
  );

  useEffect(() => {
    setSortingMaps(({ currentSortingMap }) => {
      if (sortingMapData === undefined) {
        return INITIAL_SORTING_MAPS_STATE;
      }

      const updatedSortingMap = sortingMapData.reduce(
        (newSortingMap: SortingMap, item: typeof sortingMapData[number]) => {
          newSortingMap[item.title] = item.direction;

          return newSortingMap;
        },
        {},
      );

      const sortingMapOfChanges: SortingMap = {};

      for (const key in updatedSortingMap) {
        if (updatedSortingMap[key] !== currentSortingMap[key]) {
          sortingMapOfChanges[key] = updatedSortingMap[key];
        }
      }
      return { currentSortingMap: updatedSortingMap, sortingMapOfChanges };
    });
  }, [sortingMapData]);

  useEffect(() => {
    onStateAndParamsChange?.({ page, pageSize });

    onPageControlClicker(page, pageSize);
  }, [page, pageSize, onPageControlClicker]);

  const modifiedColumns = columns.map(item => {
    const title = typeof item.title === 'function' ? item.title({}) : item.title;
    const { sortingMapOfChanges } = sortingMaps;

    const sortingOrderKey: AntdSortingOrderKey | undefined =
      typeof item.title === 'string' && sortingMapOfChanges[item.title]
        ? sortingMapOfChanges[item.title]
        : undefined;

    const itemTable = {
      ...item,
      title: <Tooltip title={title}>{title}</Tooltip>,
      className: 'table-widget-column',
    };

    if (sortingOrderKey) {
      itemTable.sortOrder = AntdSortingOrder[sortingOrderKey];
    }

    return itemTable;
  });

  const handlePageChange = (page: number): void => {
    setAntdPage(page - 1);
    setPage(page - 1);
  };

  const handlePageSizeChange = (pageSize: number): void => {
    setAntdPage(FIRST_PAGE_INDEX);
    setPage(FIRST_PAGE_INDEX);
    setPageSize(pageSize);
  };

  const handleSort = (sorter: SorterResult<object> | SorterResult<object>[]): void => {
    if (
      !Array.isArray(sorter) &&
      sorter.column !== undefined &&
      isExtendedColumnType<object>(sorter.column)
    ) {
      onOrderByClickInWizard?.(
        sorter.order === AntdSortingOrder.ASC ? SortingOrder.Asc : SortingOrder.Desc,
        sorter.column.id,
      );
    } else {
      onOrderByClickInWizard?.('', '');
    }
  };

  const handleChange = (
    { current: selectedPage, pageSize: selectedPageSize }: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<object> | SorterResult<object>[],
    extra: TableCurrentDataSource<object>,
    // eslint-disable-next-line max-params
  ): void => {
    if (extra.action === 'sort') {
      handleSort(sorter);
    }

    if (extra.action === 'paginate') {
      if (selectedPageSize !== undefined && selectedPageSize !== pageSize) {
        handlePageSizeChange(selectedPageSize);
      } else if (selectedPage !== undefined && selectedPage !== pageSize) {
        handlePageChange(selectedPage);
      }
    }

    setSortingMaps(INITIAL_SORTING_MAPS_STATE);
  };

  let slicedDataSource = dataSource;

  if (dataSource.length > pageSize) {
    slicedDataSource = dataSource.slice(0, pageSize - 1);
  }

  return (
    <Table
      className="table-widget"
      columns={modifiedColumns}
      dataSource={slicedDataSource}
      size="small"
      showSorterTooltip={false}
      title={(): string | null => title}
      scroll={{ y: '100%' }}
      pagination={{
        total: Number(totalRowsCount),
        current: antdPage + 1,
        defaultPageSize: 10,
        showTotal: (total: number): string => `Всего: ${total}`,
        showSizeChanger: true,
      }}
      onChange={handleChange}
    />
  );
}
