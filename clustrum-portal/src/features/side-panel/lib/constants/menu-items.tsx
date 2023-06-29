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
    key: Places.Root,
    icon: <FolderOutlined />,
    label: 'Все объекты',
  },
  {
    key: Places.Favorites,
    icon: <LikeOutlined />,
    label: 'Избранное',
  },
  {
    key: Places.Connections,
    icon: <ForkOutlined />,
    label: 'Подключения',
  },
  {
    key: Places.Datasets,
    icon: <DatabaseOutlined />,
    label: 'Наборы данных',
  },
  {
    key: Places.Widgets,
    icon: <LineChartOutlined />,
    label: 'Диаграммы',
  },
  {
    key: Places.Dashboards,
    icon: <DashboardOutlined />,
    label: 'Аналитические панели',
  },
];
