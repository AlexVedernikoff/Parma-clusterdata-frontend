import React, { ReactNode } from 'react';
import {
  DashboardOutlined,
  DatabaseOutlined,
  FolderOutlined,
  ForkOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { NavigationScope } from '../../../../shared/lib/constants/navigation-scope';

export const getIconByScope = (scopeType: NavigationScope): ReactNode => {
  switch (scopeType) {
    case NavigationScope.connection:
      return <ForkOutlined />;
    case NavigationScope.dash:
      return <DashboardOutlined />;
    case NavigationScope.dataset:
      return <DatabaseOutlined />;
    case NavigationScope.folder:
      return <FolderOutlined />;
    case NavigationScope.widget:
      return <LineChartOutlined />;
    default:
      return null;
  }
};
