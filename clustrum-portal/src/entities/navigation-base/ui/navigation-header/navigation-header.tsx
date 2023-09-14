import React, { ReactElement } from 'react';
import { Button, Dropdown, Input, Space } from 'antd';
import { CloseOutlined, DownOutlined, SearchOutlined } from '@ant-design/icons';
import { MenuInfo } from 'rc-menu/lib/interface';
// TODO: не по FSD, надо куда-то переместить
import { Header } from '@entities/header';
// TODO: данные функции перенести в clustrum-portal
import {
  formatPath,
  navigationItems,
} from '@kamatech-data-ui/common/src/components/Navigation/utils/header-navigation-utils';
import { INITIAL_PATH, CREATE_MENU_ITEMS } from '../../lib/constants';
import { NavigationHeaderProps, CreateMenuActionType } from '../../types';

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
      suffix={searchValue && <CloseOutlined onClick={(): void => onChangeFilter('')} />}
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
    <div>
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
