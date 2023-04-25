import React from 'react';
import './breadcrumb-wrapper.css';
import { IHeaderProps } from '../../types/IHeaderProps';

export function BreadcrumbWrapper({ props, actionsBtn }: IHeaderProps): JSX.Element {
  function getNameByKey(key: string): string {
    const matchedValues = key.match(/\/([^/]*)$/);
    return matchedValues ? matchedValues[1] : key;
  }

  // Надо выводить в разных скопах разные названия, но они в компанентах ниже, а так же крошки...

  if (props.entry) {
    return (
      <div className={'header__breadcrumb'}>
        <p className={'header__breadcrumb__patch'}>{props.entry.key}</p>
        <div className={'header__breadcrumb__title'}>
          <div className={'header__breadcrumb__title__name'}>{getNameByKey(props.entry.key)}</div>
          <div className={'header__breadcrumb__title__actions'}>
            {actionsBtn?.map((actionsBtn: object) => {
              return actionsBtn;
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={'header__breadcrumb'}>
      <p className={'header__breadcrumb__patch'}>
        {props.place}/{props.path}
      </p>
      <div className={'header__breadcrumb__title'}>
        <div className={'header__breadcrumb__title__name'}>
          <p>{props.path}</p>
        </div>
      </div>
    </div>
  );
}
