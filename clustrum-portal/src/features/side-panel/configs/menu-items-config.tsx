import {
  FolderOutlined,
  LikeOutlined,
  ForkOutlined,
  DatabaseOutlined,
  LineChartOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import React from 'react';
import { MenuProps } from 'antd';
import { ROUTES } from '../../../clustrum-lib/src/shared/lib/routes';

export const menuItemsConfig: NonNullable<MenuProps['items']> = [
  {
    key: ROUTES.navigation,
    icon: <FolderOutlined />,
    label: 'Все объекты',
  },
  {
    key: ROUTES.favorites,
    icon: <LikeOutlined />,
    label: 'Избранное',
  },
  {
    key: ROUTES.connections,
    icon: <ForkOutlined />,
    label: 'Подключения',
  },
  {
    key: ROUTES.datasets,
    icon: <DatabaseOutlined />,
    label: 'Наборы данных',
  },
  {
    key: ROUTES.widgets,
    icon: <LineChartOutlined />,
    label: 'Диаграммы',
  },
  {
    key: ROUTES.dashboards,
    icon: <DashboardOutlined />,
    label: 'Аналитические панели',
  },
];
