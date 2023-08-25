import React, { ReactNode } from 'react';
import {
  DashboardOutlined,
  DatabaseOutlined,
  FolderOutlined,
  ForkOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { NavigationScope } from '@clustrum-lib/shared/types';

export const getIconByScope = (scopeType: NavigationScope): ReactNode => {
  switch (scopeType) {
    case NavigationScope.Connection:
      return <ForkOutlined />;
    case NavigationScope.Dash:
      return <DashboardOutlined />;
    case NavigationScope.Dataset:
      return <DatabaseOutlined />;
    case NavigationScope.Folder:
      return <FolderOutlined />;
    case NavigationScope.Widget:
      return <LineChartOutlined />;
    default:
      return null;
  }
};
