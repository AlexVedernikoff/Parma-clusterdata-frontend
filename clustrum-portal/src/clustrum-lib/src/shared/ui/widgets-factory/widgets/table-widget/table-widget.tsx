import React, { useEffect, useState } from 'react';
import { Table, TablePaginationConfig, Tooltip } from 'antd';
import {
  TableWidgetProps,
  isExtendedColumnType,
  AntdSortingOrder,
  SortingOrder,
  SortingMapDataItem,
  SortingMaps,
  SortingMap,
  AntdSortingOrderKey,
} from './types';
// TODO: вынести эту бизнес логику за пределы shared слоя
import { selectNeedUniqueRows } from '../../../../../../../reducers/visualization';
import './table-widget.css';
import { useSelector } from 'react-redux';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { FIRST_PAGE_INDEX, INITIAL_SORTING_MAPS_STATE } from './lib/constants';

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

  const [initPageState, setInitPageState] = useState(initPage);
  const [page, setPage] = useState(initPageState);
  const [pageSize, setPageSize] = useState(10);
  const isNeedUniqueRows = useSelector(state => selectNeedUniqueRows(state));

  useEffect(() => {
    setInitPageState(FIRST_PAGE_INDEX);

    if (isNeedUniqueRows) {
      setInitPageState(FIRST_PAGE_INDEX);
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
      // eslint-disable-next-line no-prototype-builtins
      typeof item.title === 'string' && sortingMapOfChanges.hasOwnProperty(item.title)
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

  const handlePageChange = (page: number, pageSize: number): void => {
    setInitPageState(page - 1);
    setPage(page - 1);
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
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<object> | SorterResult<object>[],
  ): void => {
    handleSort(sorter);

    setSortingMaps(INITIAL_SORTING_MAPS_STATE);
  };

  return (
    <Table
      className="table-widget"
      columns={modifiedColumns}
      dataSource={dataSource}
      size="small"
      showSorterTooltip={false}
      title={(): string | null => title}
      scroll={{ y: '100%' }}
      pagination={{
        total: Number(totalRowsCount),
        current: initPageState + 1,
        defaultPageSize: 10,
        showTotal: (total: number): string => `Всего: ${total}`,
        showSizeChanger: true,
        onChange: handlePageChange,
      }}
      onChange={handleChange}
    />
  );
}
