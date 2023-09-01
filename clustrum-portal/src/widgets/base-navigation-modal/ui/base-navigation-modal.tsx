import React, { ReactElement, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { MenuItemType } from 'antd/es/menu/hooks/useItems';
import { SidePanel } from '@features/side-panel';
import {
  $pathInFolder,
  $place,
  changePathInFolderEvent,
  changePlaceEvent,
  getNavigationListEvent,
  NavigationBase,
} from '@entities/navigation-base';
import { NavigationModalComponentProps } from '../types';
import styles from './base-navigation-modal.module.css';
import { Places } from '@shared/config/routing';

/* компонент, который будет отображаться в новой модалке (сейчас встроен в старую реализацию) */
export function BaseNavigationModal(props: NavigationModalComponentProps): ReactElement {
  const { path, sdk } = props;

  const [
    changePlace,
    changePathInFolder,
    place,
    pathInFolder,
    getNavigationList,
  ] = useUnit([
    changePlaceEvent,
    changePathInFolderEvent,
    $place,
    $pathInFolder,
    getNavigationListEvent,
  ]);

  useEffect(() => {
    /**
     * после настройки react-router для всех компонентов
     * возможно, можно получить начальное значение pathInFolder из
     * модели, сделав запрос getEntry, (поле key), пока path тянется из props
     * (старая реализация)
     * */
    changePathInFolder(path);
    getNavigationList();
  }, []);

  const handleClickSidePanelMenuItem = (menuItem: MenuItemType): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore TODO: разобраться, почему возникает ошибка при передаче параметра
    changePlace(menuItem.key as Places);
    changePathInFolder('/');
    getNavigationList();
  };

  return (
    <div className={styles['base-navigation-modal']}>
      <div className={styles['base-navigation-modal__header']}>Навигатор объектов</div>
      <div className={styles['base-navigation-modal__content']}>
        <SidePanel
          withHeader={false}
          onClickMenuItem={handleClickSidePanelMenuItem}
          selectedItem={[place]}
        />
        <div className={styles['base-navigation-modal__navigation']}>
          <NavigationBase
            sdk={sdk}
            isModalView
            path={pathInFolder}
            place={place}
            updateData={getNavigationList}
          />
        </div>
      </div>
    </div>
  );
}
