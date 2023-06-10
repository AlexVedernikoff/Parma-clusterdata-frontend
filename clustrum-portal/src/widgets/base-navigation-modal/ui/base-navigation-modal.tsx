import { ReactElement, useEffect, useState } from 'react';
import React from 'react';
import { MenuItemType } from 'antd/es/menu/hooks/useItems';
import { SidePanel } from '../../../features/side-panel/ui/side-panel';

import { useUnit } from 'effector-react';
import { Places } from '../../../shared/lib/constants/places';
import {
  $pathInFolder,
  $place,
  changePathInFolderEvent,
  changePlaceEvent,
  getNavigationListEvent,
} from '../../../shared/model/navigation-base-model';
import { NavigationBase } from '../../../features/navigation-base/ui/navigation-base';
import './base-navigation-modal.css';

interface NavigationModalComponentProps {
  path: string;
  /**
   * TODO: убрать данное поле после рефакторинга, нужно для совместимости со старым кодом
   */
  sdk: any;
}
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

  const onClickSidePanelMenuItem = (menuItem: MenuItemType): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore TODO: разобраться, почему возникает ошибка при передаче параметра
    changePlace(menuItem.key as Places);
    changePathInFolder('/');
    getNavigationList();
  };

  return (
    <div className="base-navigation-modal">
      <div className="base-navigation-modal__header">Навигатор объектов</div>
      <div className="base-navigation-modal__content">
        <SidePanel
          withHeader={false}
          onClickMenuItem={onClickSidePanelMenuItem}
          selectedItem={[place]}
        />
        <div className="base-navigation-modal__navigation">
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
