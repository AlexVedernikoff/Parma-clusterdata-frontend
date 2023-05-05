import React from 'react';
import './breadcrumb-wrapper.css';
import { Breadcrumb } from 'antd';
import { FormatPath, NavigationItems } from '../../model/navigation';
import { HeaderProps } from '../../types/headerProps';

export function BreadcrumbWrapper({ actionsBtn, ...props }: HeaderProps): JSX.Element {
  const { entry, place, path } = props;

  const breadcrumbItems = entry ? NavigationItems(entry.scope, entry.key) : NavigationItems(place, path);

  return (
    <div className={'header__breadcrumb'}>
      <div className={'header__breadcrumb-patch'}>
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className={'header__breadcrumb-title'}>
        <div className={'header__breadcrumb-title-name'}>{FormatPath(entry?.key ?? (path === '' ? place : path))}</div>

        {actionsBtn && (
          <div className={'header__breadcrumb-title-actions'}>{actionsBtn.map((actionBtn: object) => actionBtn)}</div>
        )}
      </div>
    </div>
  );
}
