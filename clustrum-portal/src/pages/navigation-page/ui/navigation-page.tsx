import React, { ReactElement, useCallback, useEffect } from 'react';
import { useParams } from 'react-router';
import { useUnit } from 'effector-react';

import {
  getNavigationListEvent,
  getNavigationDataByEntryIdEvent,
  changePathInFolderEvent,
  changePlaceEvent,
} from '../../../shared/model/navigation-base-model';
import { NavigationBase } from '../../../features/navigation-base/ui/navigation-base';
import { useCurrentPlace } from '../../../features/navigation-base/lib/hooks/use-current-place';
import { Places } from '../../../shared/lib/constants/places';

interface NavigationPage {
  /**
   * TODO: пока необходим для работы модальных окон, удалить
   * 1. после рефакторинга модалок (создание элементов и изменение элементов в навигации)
   * 2. после переключения всех страниц на единый роутер
   */
  sdk: any;
}

export function NavigationPage({ sdk }: NavigationPage): ReactElement | null {
  const [
    getNavigationDataByEntryId,
    getNavigationList,
    changePathInFolder,
    changePlace,
  ] = useUnit([
    getNavigationDataByEntryIdEvent,
    getNavigationListEvent,
    changePathInFolderEvent,
    changePlaceEvent,
  ]);

  const place = useCurrentPlace();
  const { path: entryId, root } = useParams<{ path?: string; root?: string }>();

  const getNavigation = useCallback(() => {
    if (entryId) {
      getNavigationDataByEntryId({ entryId });
    } else {
      changePathInFolder('/');
      getNavigationList();
    }
  }, [changePathInFolder, entryId, getNavigationDataByEntryId, getNavigationList]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore TODO: разобраться, почему возникает ошибка при передаче параметра
    changePlace(place as Places);
    getNavigation();
  }, [getNavigation, place, changePlace]);

  return place ? (
    <div className="navigation-page">
      <NavigationBase sdk={sdk} path={'/'} place={place} updateData={getNavigation} />
    </div>
  ) : null;
}
