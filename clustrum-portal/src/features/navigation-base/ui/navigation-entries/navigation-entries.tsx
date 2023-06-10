import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import { Empty, Table, TableProps } from 'antd';
import { useUnit } from 'effector-react';
import { SortOrder, SorterResult } from 'antd/es/table/interface';
import { generatePath, useHistory } from 'react-router';
import './navigation-entries.css';
import {
  $error,
  $navigationParams,
  $pending,
  addFavoritesEvent,
  changeParamsEvent,
  getNavigationDataByEntryIdEvent,
  getNavigationListEvent,
  removeFavoritesEvent,
  $navigationListStore,
  $pathInFolder,
  $place,
  changePlaceEvent,
  changePathInFolderEvent,
} from '../../../../shared/model/navigation-base-model';
import { MAP_PLACE_TO_PATH_IN_FOLDER } from '../../lib/constants/map-place-to-path-in-folder';
import { Places } from '../../../../shared/lib/constants/places';
import { ToggleFavoriteParams } from '../../types/toggle-favorite-params';
import { MAP_NAVIGATION_SCOPE_TO_PATH } from '../../../../shared/lib/constants/map-navigation-scope-to-path';
import { NavigationItem } from '../../../../shared/types/navigation-item';
import { NavigationScope } from '../../../../shared/lib/constants/navigation-scope';
import { NavigationError } from '../navigation-error/navigation-error';
import { NavigationHeader } from '../navigation-header/navigation-header';
import { CreateMenuActionType } from '../../lib/constants/create-menu-action-type';
import { Order } from '../../../../shared/lib/constants/order';
import { navigationTableColumnsConfig } from '../../configs/navigation-table-columns-config';
import { NavItemContextMenuClickParams } from '../../types/nav-item-context-menu-click-params';

interface NavigationProps {
  isModalView: boolean;
  showHidden: boolean;
  onCreateMenuClick: (value: CreateMenuActionType) => void;
  onContextMenuClick: (params: NavItemContextMenuClickParams) => Promise<void> | boolean;
  onRetry: () => void;
}

/**
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
    navigationList,
    pending,
    getNavigationList,
    changeParams,
    getNavigationDataByEntryId,
    navigationParams,
    error,
    addFavorites,
    removeFavorites,
    pathInFolder,
    place,
    changePlace,
    changePathInFolder,
  ] = useUnit([
    $navigationListStore,
    $pending,
    getNavigationListEvent,
    changeParamsEvent,
    getNavigationDataByEntryIdEvent,
    $navigationParams,
    $error,
    addFavoritesEvent,
    removeFavoritesEvent,
    $pathInFolder,
    $place,
    changePlaceEvent,
    changePathInFolderEvent,
  ]);

  const [searchValue, setSearchValue] = useState<string>('');
  const history = useHistory();

  const locale = useMemo(
    () => ({
      emptyText: (
        <Empty description={searchValue ? 'Ничего не найдено' : 'Пустая папка'} />
      ),
    }),
    [searchValue],
  );

  const toggleFavorite = useCallback(
    (params: ToggleFavoriteParams) => {
      if (params.isFavorite) {
        removeFavorites({ entryId: params.entryId });
      } else {
        addFavorites({ entryId: params.entryId });
      }
    },
    [addFavorites, removeFavorites],
  );

  const navigationTableColumns = useMemo(
    () =>
      navigationTableColumnsConfig({
        handleToggleFavorite: toggleFavorite,
        onContextMenuClick: onContextMenuClick,
      }),
    [toggleFavorite, onContextMenuClick],
  );

  // TODO: поле сортировки есть на бэке, но не работает,
  // пока оставил функцию для обработки клика по заголовку
  // после уточнения на бэке либо использовать, либо убрать
  // const onChange: TableProps<NavigationItem>['onChange'] = (
  //   pagination,
  //   filters,
  //   sorter,
  //   extra,
  // ) => {
  //   if (extra.action === 'sort') {
  //     const currentOrder = (sorter as SorterResult<NavigationItem>).order;
  //     const order =
  //       currentOrder === 'ascend'
  //         ? Order.asc
  //         : currentOrder === 'descend'
  //         ? Order.desc
  //         : undefined;
  //   }
  // };

  const handleActionOnRow = useCallback(
    (rowData: NavigationItem, rowIndex?: number) => ({
      onClick: (event: React.MouseEvent<HTMLElement>): void => {
        if (!place) {
          return;
        }
        if (rowData.scope === NavigationScope.folder) {
          if (isModalView) {
            changePathInFolder(rowData.key);
            getNavigationList();
            return;
          }
          const path = generatePath(MAP_PLACE_TO_PATH_IN_FOLDER[place as Places], {
            id: rowData.entryId,
          });
          history.push(path);
        } else {
          const path = generatePath(MAP_NAVIGATION_SCOPE_TO_PATH[rowData.scope], {
            id: rowData.entryId,
          });
          window.location.pathname = path;
        }
      },
    }),
    [changePathInFolder, getNavigationList, history, isModalView, place],
  );

  const filteredNavigationList = useMemo(() => {
    const navigationListItems = navigationList?.entries;
    if (!searchValue) {
      return navigationListItems;
    }

    return navigationListItems?.filter(entry => {
      const showEntry = !entry?.hidden || showHidden;
      return showEntry && entry?.name.toLowerCase().includes(searchValue.toLowerCase());
    });
  }, [searchValue, navigationList?.entries, showHidden]);

  if (error) {
    return <NavigationError error={error} onRetry={onRetry} />;
  }

  return (
    <div className="navigation-entries">
      <NavigationHeader
        isModalView={isModalView}
        path={pathInFolder}
        searchValue={searchValue}
        onChangeFilter={setSearchValue}
        place={place}
        onCreateMenuClick={onCreateMenuClick}
      />
      <div className="navigation-entries__table">
        <Table
          columns={navigationTableColumns}
          dataSource={filteredNavigationList}
          loading={pending}
          locale={locale}
          // onChange={onChange}
          onRow={handleActionOnRow}
          size={isModalView ? 'middle' : undefined}
          scroll={{ y: '100%' }}
          tableLayout="auto"
        />
      </div>
    </div>
  );
}
