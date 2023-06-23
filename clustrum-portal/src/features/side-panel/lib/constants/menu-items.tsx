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
import { ROUTES } from '@shared/lib/constants/routes';

export const MENU_ITEMS: NonNullable<MenuProps['items']> = [
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
