import React, { useCallback, useState, ReactElement } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { MenuItemType } from 'antd/es/menu/hooks/useItems';
import Icons, { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Menu, theme } from 'antd';

import { useActiveMenuItemKey } from '../lib/hooks/use-active-menu-item-key';
import { MENU_ITEMS } from '../lib/constants/menu-items';
import { RedLogo } from './red-logo';
import { SidePanelProps } from '../types';

import './side-panel.css';

const { useToken } = theme;

export function SidePanel({ withReactRouter = false }: SidePanelProps): ReactElement {
  const [collapsed, setCollapsed] = useState(false);
  const history = useHistory();
  const selectedKey = useActiveMenuItemKey();
  const { token } = useToken();

  const handleSidePanelItemClick = useCallback(
    (item: MenuItemType) => {
      if (!withReactRouter) {
        window.location.pathname = item.key.toString();
      } else {
        history.push(item.key.toString());
      }
    },
    [history, withReactRouter],
  );

  return (
    <div className="side-panel">
      <div
        className={classNames('side-panel__header', {
          'side-panel__header--collapsed': collapsed,
        })}
      >
        <Icons component={RedLogo} style={{ color: token.colorPrimary }} />
        <span
          className={classNames('side-panel__header-title', {
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
