import React, { useState, ReactElement } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { MenuItemType } from 'antd/es/menu/hooks/useItems';
import Icons, { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Menu, theme } from 'antd';

import { useActiveMenuItemKey } from '../lib/hooks';
import { MENU_ITEMS } from '../lib/constants';
import { RedLogo } from './red-logo';
import { SidePanelProps } from '../types';
import { MAP_PLACE_TO_ROUTE } from '../lib/constants';
import { Places } from '@shared/config/routing/places';

import styles from './side-panel.module.css';

const { useToken } = theme;

export function SidePanel(props: SidePanelProps): ReactElement {
  const {
    withReactRouter = false,
    withHeader = true,
    onClickMenuItem,
    selectedItem,
  } = props;

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const history = useHistory();
  const selectedKey = useActiveMenuItemKey();
  const { token } = useToken();

  const handleSidePanelItemClick = (item: MenuItemType): void => {
    if (onClickMenuItem) {
      onClickMenuItem(item);
      return;
    }

    const route = MAP_PLACE_TO_ROUTE[item.key as Places];
    if (withReactRouter) {
      history.push(route);
    } else {
      window.location.pathname = route;
    }
  };

  const sidePanelHeaderClass = classNames(styles['side-panel__header'], {
    [styles['side-panel__header--collapsed']]: collapsed,
  });

  const sidePanelHeaderTitleClass = classNames(styles['side-panel__header-title'], {
    [styles['side-panel__header-title--collapsed']]: collapsed,
  });

  return (
    <div className={styles['side-panel']}>
      {withHeader && (
        <div className={sidePanelHeaderClass}>
          <Icons component={RedLogo} style={{ color: token.colorPrimary }} />
          <span className={sidePanelHeaderTitleClass}>Кластрум</span>
        </div>
      )}
      <nav className={styles['side-panel__content']}>
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          items={MENU_ITEMS}
          selectedKeys={selectedItem || selectedKey}
          onClick={handleSidePanelItemClick}
        />
      </nav>
      <button
        className={styles['side-panel__footer']}
        onClick={(): void => {
          setCollapsed(prev => !prev);
        }}
      >
        {collapsed ? (
          <RightOutlined className={styles['side-panel__footer-icon']} />
        ) : (
          <LeftOutlined className={styles['side-panel__footer-icon']} />
        )}
      </button>
    </div>
  );
}
