import React, { ReactElement, useEffect } from 'react';
import { useParams } from 'react-router';
import { useUnit } from 'effector-react';
import {
  NavigationBase,
  useCurrentPlace,
  changePathInFolderEvent,
  changePlaceEvent,
  getNavigationDataByEntryIdEvent,
  getNavigationListEvent,
} from '@entities/navigation-base';
import { NavigationPage } from '../types';
import styles from './navigation-page.module.css';
import { Places } from '@shared/config/routing';

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

  const getNavigation = (): void => {
    if (entryId) {
      getNavigationDataByEntryId({ entryId });
    } else {
      changePathInFolder('/');
      getNavigationList();
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore TODO: разобраться, почему возникает ошибка при передаче параметра
    changePlace(place as Places);
    getNavigation();
  }, [place, entryId]);

  return place ? (
    <div className={styles['navigation-page']}>
      <NavigationBase sdk={sdk} path={'/'} place={place} updateData={getNavigation} />
    </div>
  ) : null;
}
