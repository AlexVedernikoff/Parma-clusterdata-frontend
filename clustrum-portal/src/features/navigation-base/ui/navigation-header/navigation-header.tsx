import React, { ReactElement, useCallback, useMemo } from 'react';
import { Button, Dropdown, Input, Space } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Header } from '../../../../entities/header/ui/header';
import {
  formatPath,
  navigationItems,
} from '../../../../../kamatech_modules/@kamatech-data-ui/common/src/components/Navigation/utils/header-navigation-utils';
import { Places } from '../../../../shared/lib/constants/places';
import { INITIAL_PATH } from '../../lib/constants/initial-path';
import { CreateMenuActionType } from '../../lib/constants/create-menu-action-type';
import { CREATE_MENU_ITEMS } from '../../lib/constants/create-menu-items';

interface NavigationHeaderProps {
  isModalView: boolean;
  place: Places | null;
  path: string;
  searchValue: string;
  onChangeFilter: (searchValue: string) => void;
  onCreateMenuClick: (value: CreateMenuActionType) => void;
}

export function NavigationHeader(props: NavigationHeaderProps): ReactElement {
  const {
    isModalView,
    place,
    path,
    searchValue,
    onChangeFilter,
    onCreateMenuClick,
  } = props;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeFilter(event.target.value);
    },
    [onChangeFilter],
  );

  const formatPlace = useMemo(() => place || '', [place]);

  const inputSearch = useMemo(
    () => (
      <Input
        className="ant-d-input-search"
        placeholder="Найти"
        prefix={<SearchOutlined />}
        onChange={handleChange}
        value={searchValue}
      />
    ),
    [handleChange, searchValue],
  );

  const createButton = (
    <Dropdown
      menu={{
        items: CREATE_MENU_ITEMS,
        onClick: (menuInfo): void => {
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
