import React from 'react';
import { Breadcrumb, Tooltip } from 'antd';
import { HeaderProps } from '../types';

import './header.css';
import { Link, generatePath, useHistory } from 'react-router-dom';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { useUnit } from 'effector-react';
import { Places, ROUTES } from '@shared/config/routing';
// eslint-disable-next-line boundaries/element-types
import { $pathInFolder, $place } from '@entities/navigation-base';
import { getEntryDataByPathApi } from '../api/get-entry-by-path-api';
// eslint-disable-next-line boundaries/element-types
import { MAP_PLACE_TO_PATH_IN_FOLDER } from '@entities/navigation-base/lib/constants';
import { $appSettingsStore } from '@shared/app-settings';

export function Header(props: HeaderProps): JSX.Element {
  const { leftSideContent, rightSideContent, path, title } = props;
  const history = useHistory();
  const [place, pathInFolder] = useUnit([$place, $pathInFolder]);

  const enableBreadcrumbs = $appSettingsStore.getState().theme.layout.showBreadcrumbs;

  function breadCrumbItemRender(route: any, _: any, items: ItemType[]): JSX.Element {
    const isLastItem = items.indexOf(route) === items.length - 1;
    const getEntryPath = async (): Promise<void> => {
      const targetUrlKey = route.title + ROUTES.root;

      if (pathInFolder.includes(targetUrlKey)) {
        const newUrlPath = pathInFolder.substring(
          0,
          pathInFolder.indexOf(targetUrlKey) + targetUrlKey.length,
        );
        const entryData = await getEntryDataByPathApi(newUrlPath);
        history.push(
          generatePath(MAP_PLACE_TO_PATH_IN_FOLDER[place as Places], {
            id: entryData.entryId,
          }),
        );
      } else {
        history.push(place === Places.Root ? ROUTES.root : ROUTES.root + place);
      }
    };

    return isLastItem ? (
      <span>{route.title}</span>
    ) : (
      <Link onClick={getEntryPath} to={'#'}>
        {route.title}
      </Link>
    );
  }

  return (
    <header className="header-wrapper">
      {enableBreadcrumbs && (
        <div className="header-wrapper__breadcrumb">
          <div className="header-wrapper__breadcrumb-patch">
            <Breadcrumb itemRender={breadCrumbItemRender} items={path} />
          </div>
        </div>
      )}
      <div className="header-wrapper__content">
        <div className="header-wrapper__left-side">
          {title && (
            <Tooltip placement="bottomRight" arrow={false} title={title}>
              <div className="header-wrapper__left-side-title">{title}</div>
            </Tooltip>
          )}
          {leftSideContent && (
            <div className="header-wrapper__left-side-content">{leftSideContent}</div>
          )}
        </div>
        <div className="header-wrapper__right-side-content">{rightSideContent}</div>
      </div>
    </header>
  );
}
