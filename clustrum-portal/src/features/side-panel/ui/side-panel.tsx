import React, { useCallback, useState, ReactElement } from 'react';
import cn from 'classnames';
import { useHistory } from 'react-router-dom';
import { MenuItemType } from 'antd/es/menu/hooks/useItems';
import { LeftOutlined, PieChartFilled, RightOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

import { useActiveMenuItemKey } from '../lib/hooks/use-active-menu-item-key';
import './side-panel.css';
import { MENU_ITEMS } from '../lib/constants/menu-items';

interface SidePanelProps {
  withoutReactRouter?: boolean;
}

export function SidePanel({ withoutReactRouter }: SidePanelProps): ReactElement {
  const [collapsed, setCollapsed] = useState(false);
  const history = useHistory();
  const selectedKey = useActiveMenuItemKey();

  const handleSidePanelItemClick = useCallback(
    (item: MenuItemType) => {
      if (withoutReactRouter) {
        window.location.pathname = item.key.toString();
      } else {
        history.push(item.key.toString());
      }
    },
    [history, withoutReactRouter],
  );

  return (
    <div className="side-panel">
      <div
        className={cn('side-panel__header', {
          'side-panel__header--collapsed': collapsed,
        })}
      >
        <PieChartFilled className="side-panel__header-icon" />
        <span
          className={cn('side-panel__header-title', {
            'side-panel__header-title--collapsed': collapsed,
          })}
        >
          Кластрум
        </span>
      </div>
      <nav className="side-panel__content">
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          items={MENU_ITEMS}
          selectedKeys={selectedKey}
          onClick={handleSidePanelItemClick}
        />
      </nav>
      <button
        className="side-panel__footer"
        onClick={(): void => {
          setCollapsed(!collapsed);
        }}
      >
        {collapsed ? (
          <RightOutlined className="side-panel__footer-icon" />
        ) : (
          <LeftOutlined className="side-panel__footer-icon" />
        )}
      </button>
    </div>
  );
}
