import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { useHistory } from 'react-router-dom';
import { MenuItemType } from 'antd/es/menu/hooks/useItems';
import { LeftOutlined, PieChartFilled, RightOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

import { menuItemsConfig } from './configs/menu-items-config';
import { useActiveMenuItemKey } from './lib/hooks/use-active-menu-item-key';
import './side-panel.css';

export const SidePanel: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const history = useHistory();
  const selectedKey = useActiveMenuItemKey();

  const toggleCollapsed = (): void => {
    setCollapsed(!collapsed);
  };

  const onSidePanelItemClick = useCallback(
    (item: MenuItemType) => {
      history.push(item.key.toString());
    },
    [history],
  );

  return (
    <div className="side-panel">
      <div className={cn('side-panel-header', { 'side-panel-header_collapsed': collapsed })}>
        <PieChartFilled className="side-panel-header__icon" />
        <span className={cn('side-panel-header__title', { 'side-panel-header__title_collapsed': collapsed })}>
          Анализ данных
        </span>
      </div>
      <div className="side-panel-content">
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          items={menuItemsConfig}
          selectedKeys={selectedKey}
          onClick={onSidePanelItemClick}
        />
      </div>
      <div className="side-panel-footer" onClick={toggleCollapsed}>
        {collapsed ? (
          <RightOutlined className="side-panel-footer__icon" />
        ) : (
          <LeftOutlined className="side-panel-footer__icon" />
        )}
      </div>
    </div>
  );
};
