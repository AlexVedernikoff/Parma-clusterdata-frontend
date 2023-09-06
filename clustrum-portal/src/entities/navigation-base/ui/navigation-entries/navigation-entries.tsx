import React, { ReactElement, useState } from 'react';
import { Empty, Table } from 'antd';
import { useUnit } from 'effector-react';
import { generatePath, useHistory } from 'react-router';
import {
  MAP_NAVIGATION_SCOPE_TO_PATH,
  MAP_PLACE_TO_PATH_IN_FOLDER,
} from '../../lib/constants';
import { Places } from '@shared/config/routing/places';
import { ToggleFavoriteParams, NavigationProps } from '../../types';
import { NavigationError } from '../navigation-error/navigation-error';
import { NavigationHeader } from '../navigation-header/navigation-header';
import styles from './navigation-entries.module.css';
import { getNavigationTableColumns } from '../../lib/utils';
import {
  $error,
  $navigationListStore,
  $pathInFolder,
  $pending,
  $place,
  addFavoritesEvent,
  changePathInFolderEvent,
  getNavigationListEvent,
  removeFavoritesEvent,
} from '../../model/navigation-base';
import { NavigationEntryData, NavigationScope } from '@clustrum-lib/shared/types';

/**
 * TODO
 * здесь происходят основные действия с навигацией
 * т.к. есть страница навигации и дублирующее её модальное окно, то всё происходит по одной модели navigation-base
 * и для страницы навигации и для модалки - одинаковый экземпляр модели
 * возможно, имеет смысл создавать 2 разных экземпляра, с разными сторами, эффектами и т.д., чтоб случайно не произошло их пересечения
 * const newModel = navigationBaseModel()
 * а сюда прокидывать уже экземпляры модели (копии стора, эффектов и эвентов)
 *
 *
 * NavigationMinimal - ещё одна навигация, в старом модальном окне, у неё похожий процесс, но для неё не стоит navigation-base использовать, там половины действий нет
 *
 * также появилась идея вынести это из ui, например, в отдельную фичу
 *
 */
export function NavigationEntries(props: NavigationProps): ReactElement {
  const {
    onCreateMenuClick,
    isModalView,
    showHidden,
    onContextMenuClick,
    onRetry,
  } = props;

  const [
    getNavigationList,
    navigationList,
    removeFavorites,
    addFavorites,
    place,
    changePathInFolder,
    pathInFolder,
    pending,
    error,
  ] = useUnit([
    getNavigationListEvent,
    $navigationListStore,
    removeFavoritesEvent,
    addFavoritesEvent,
    $place,
    changePathInFolderEvent,
    $pathInFolder,
    $pending,
    $error,
  ]);

  const [searchValue, setSearchValue] = useState<string>('');
  const history = useHistory();

  const locale = {
    emptyText: <Empty description={searchValue ? 'Ничего не найдено' : 'Пустая папка'} />,
  };

  const toggleFavorite = (params: ToggleFavoriteParams): void => {
    if (params.isFavorite) {
      removeFavorites({ entryId: params.entryId });
    } else {
      addFavorites({ entryId: params.entryId });
    }
  };

  const navigationTableColumns = getNavigationTableColumns({
    handleToggleFavorite: toggleFavorite,
    onContextMenuClick: onContextMenuClick,
  });

  // TODO: разобраться с типом any, не удалось вытащить из библиотеки
  const handleActionOnRow = (rowData: NavigationEntryData): any => ({
    onClick: (): void => {
      if (!place) {
        return;
      }
      if (rowData.scope === NavigationScope.Folder) {
        if (isModalView) {
          changePathInFolder(rowData.key);
          getNavigationList();
          return;
        }
        const path = generatePath(MAP_PLACE_TO_PATH_IN_FOLDER[place as Places], {
          id: rowData.entryId,
        });
        history.push(path);
        return;
      }
      const path = generatePath(MAP_NAVIGATION_SCOPE_TO_PATH[rowData.scope], {
        id: rowData.entryId,
      });
      window.location.pathname = path;
    },
  });

  const getFilteredNavigationList = (): NavigationEntryData[] | undefined => {
    const navigationListItems = navigationList?.entries;
    if (!searchValue) {
      return navigationListItems;
    }

    return navigationListItems?.filter(entry => {
      const showEntry = !entry?.hidden || showHidden;
      return showEntry && entry?.name.toLowerCase().includes(searchValue.toLowerCase());
    });
  };

  if (error) {
    return <NavigationError error={error} onRetry={onRetry} />;
  }

  return (
    <div className={styles['navigation-entries']}>
      <NavigationHeader
        isModalView={isModalView}
        path={pathInFolder}
        searchValue={searchValue}
        onChangeFilter={setSearchValue}
        place={place}
        onCreateMenuClick={onCreateMenuClick}
      />
      <div className={styles['navigation-entries__table']}>
        <Table
          columns={navigationTableColumns}
          dataSource={getFilteredNavigationList()}
          loading={pending}
          locale={locale}
          onRow={handleActionOnRow}
          size={isModalView ? 'middle' : undefined}
          scroll={{ y: '100%' }}
          tableLayout="auto"
        />
      </div>
    </div>
  );
}
