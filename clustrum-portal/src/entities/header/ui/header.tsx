import React from 'react';
import './header.css';
import { HeaderProps } from '../types/HeaderProps';
import { NavigationItems, FormatPath } from '../model/navigation';
import { Breadcrumb } from 'antd';

export function Header({ leftSideContent, rightSideContent, ...props }: HeaderProps): JSX.Element {
  const { entry, place, path } = props;

  const breadcrumbItems = entry ? NavigationItems(entry.scope, entry.key) : NavigationItems(place, path);

  function renderRightButtons(): JSX.Element[] {
    return rightSideContent.map((item: JSX.Element) => item);
  }

  return (
    <header className={'header'}>
      <div>
        <div className={'header__breadcrumb'}>
          <div className={'header__breadcrumb-patch'}>
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        <div>
          <div className={'header__title'}>
            <div className={'header__title-name'}>{FormatPath(entry?.key ?? (path === '' ? place : path))}</div>

            {leftSideContent && (
              <div className={'header__title-actions'}>{leftSideContent.map((actionBtn: object) => actionBtn)}</div>
            )}
          </div>
        </div>
      </div>

      <div className={'header__action-buttons'}>{renderRightButtons()}</div>
    </header>
  );
}
