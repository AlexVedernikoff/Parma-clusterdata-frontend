import React from 'react';
import { NavigationItems, FormatPath } from '../model/navigation';
import { Breadcrumb } from 'antd';

import './header.css';

interface HeaderProps {
  entry?: {
    scope: string;
    key: string;
  };
  place: string;
  path: string;
  rightSideContent: JSX.Element[];
  leftSideContent?: JSX.Element[];
}

export function Header({ leftSideContent, rightSideContent, entry, place, path }: HeaderProps): JSX.Element {
  const breadcrumbItems = NavigationItems(place, path);

  function renderRightButtons(): JSX.Element[] {
    return rightSideContent.map((item: JSX.Element) => item);
  }

  return (
    <header className="header">
      <div>
        <div className="header__breadcrumb">
          <div className="header__breadcrumb-patch">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        <div>
          <div className="header__title">
            <div className="header__title-name">{FormatPath(entry?.key ?? (path === '' ? place : path))}</div>

            {leftSideContent && (
              <div className="header__title-actions">{leftSideContent.map((actionBtn: object) => actionBtn)}</div>
            )}
          </div>
        </div>
      </div>

      <div className="header__action-buttons">{renderRightButtons()}</div>
    </header>
  );
}
