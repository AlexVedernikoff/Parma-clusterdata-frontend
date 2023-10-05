import React from 'react';
import { Dropdown, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import { ContextMenuActions, NavigationTableColumnConfigParams } from '../../types';
import { NAVIGATION_ENTRY_ACTIONS } from '../constants';
import { NavigationEntryData } from '@clustrum-lib/shared/types';
import { CreateHyperlink } from './create-hyperlink';

const stringSorter = (field: 'createdBy' | 'name') => (
  a: NavigationEntryData,
  b: NavigationEntryData,
): number => (a[field] > b[field] ? 1 : -1);

export const getNavigationTableColumns = ({
  handleToggleFavorite,
  onContextMenuClick,
}: NavigationTableColumnConfigParams): ColumnsType<NavigationEntryData> => [
  {
    title: 'Название',
    dataIndex: 'name',
    key: 'name',
    render: (name, record): JSX.Element => (
      <CreateHyperlink record={record} name={name} />
    ),
    sorter: stringSorter('name'),
    width: '30%',
  },
  {
    title: 'Автор',
    dataIndex: 'createdBy',
    key: 'createdBy',
    sorter: stringSorter('createdBy'),
  },
  {
    title: 'Дата создания',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: (a, b): number => {
      const firstDate = new Date(a.createdAt).getTime();
      const secondDate = new Date(b.createdAt).getTime();
      return firstDate - secondDate;
    }, // TODO: поставить значение sorter: truе, когда будет сортировка на бэке (в api есть, но не работает)
    showSorterTooltip: false,
    width: 150,
    render: date => moment(date).format('DD MMMM YYYY'),
  },
  {
    title: 'Действия',
    key: 'actions',
    width: 340,
    render: (_, record) => (
      <Space size="middle" align="center">
        <a
          onClick={(event): void => {
            event.stopPropagation();
            handleToggleFavorite({
              entryId: record.entryId,
              isFavorite: record.isFavorite,
            });
          }}
        >
          {record.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        </a>
        <Dropdown
          menu={{
            items: NAVIGATION_ENTRY_ACTIONS,
            onClick: (menuInfo): void => {
              menuInfo.domEvent.stopPropagation();
              onContextMenuClick({
                entry: record,
                action: menuInfo.key as ContextMenuActions,
              });
            },
          }}
        >
          <a
            onClick={(event): void => {
              event.stopPropagation();
            }}
          >
            <Space>
              Дополнительно
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Space>
    ),
  },
];
