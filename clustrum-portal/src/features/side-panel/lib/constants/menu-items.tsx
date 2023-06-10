import React from 'react';
import {
  FolderOutlined,
  LikeOutlined,
  ForkOutlined,
  DatabaseOutlined,
  LineChartOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';
import { Places } from '@shared/lib/constants/places';

export const MENU_ITEMS: NonNullable<MenuProps['items']> = [
  {
    key: Places.root,
    icon: <FolderOutlined />,
    label: 'Все объекты',
  },
  {
    key: Places.favorites,
    icon: <LikeOutlined />,
    label: 'Избранное',
  },
  {
    key: Places.connections,
    icon: <ForkOutlined />,
    label: 'Подключения',
  },
  {
    key: Places.datasets,
    icon: <DatabaseOutlined />,
    label: 'Наборы данных',
  },
  {
    key: Places.widgets,
    icon: <LineChartOutlined />,
    label: 'Диаграммы',
  },
  {
    key: Places.dashboards,
    icon: <DashboardOutlined />,
    label: 'Аналитические панели',
  },
];
