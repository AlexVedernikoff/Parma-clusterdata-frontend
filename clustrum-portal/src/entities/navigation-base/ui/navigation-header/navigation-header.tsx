import React, { ReactElement } from 'react';
import { Button, Dropdown, Input, Space } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { MenuInfo } from 'rc-menu/lib/interface';
import { Header } from '@entities/header';
import {
  formatPath,
  navigationItems,
} from '../../../../../kamatech_modules/@kamatech-data-ui/common/src/components/Navigation/utils/header-navigation-utils';
import { INITIAL_PATH, CREATE_MENU_ITEMS } from '../../lib/constants';
import { NavigationHeaderProps } from '../../types';
import { CreateMenuActionType } from '@entities/navigation-base/types';

export function NavigationHeader(props: NavigationHeaderProps): ReactElement {
  const {
    isModalView,
    place,
    path,
    searchValue,
    onChangeFilter,
    onCreateMenuClick,
  } = props;

  const formatPlace = place || '';

  const inputSearch = (
    <Input
      className="ant-d-input-search"
      placeholder="Найти"
      prefix={<SearchOutlined />}
      onChange={(event): void => {
        onChangeFilter(event.target.value);
      }}
      value={searchValue}
    />
  );

  const createButton = (
    <Dropdown
      menu={{
        items: CREATE_MENU_ITEMS,
        onClick: (menuInfo: MenuInfo): void => {
          onCreateMenuClick(menuInfo.key as CreateMenuActionType);
        },
      }}
      trigger={['click']}
    >
      <Button type="primary">
        <Space>
          Создать
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );

  return (
    <div className="navigation-header">
      {isModalView ? (
        <Header
          leftSideContent={inputSearch}
          rightSideContent={createButton}
          path={navigationItems(formatPlace, path)}
        />
      ) : (
        <Header
          rightSideContent={
            <>
              {inputSearch}
              {createButton}
            </>
          }
          path={navigationItems(formatPlace, path)}
          title={formatPath(path === INITIAL_PATH ? formatPlace : path)}
        />
      )}
    </div>
  );
}
