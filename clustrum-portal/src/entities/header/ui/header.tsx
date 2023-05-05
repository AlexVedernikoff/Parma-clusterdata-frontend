import React from 'react';
import { BreadcrumbWrapper } from './breadcrumb-wrapper/breadcrumb-wrapper';
import './header.css';
import { HeaderProps } from '../types/headerProps';

export function Header({ actionsBtn, rightButtons, ...props }: HeaderProps): JSX.Element {
  const { entry, rightItems } = props;

  function renderRightButtons(): JSX.Element[] | undefined {
    const buttons = entry ? rightItems : rightButtons;
    return buttons?.map((item: JSX.Element) => item);
  }

  return (
    <header className={'header'}>
      <BreadcrumbWrapper actionsBtn={actionsBtn} {...props} />

      <div className={'header__action-buttons'}>{renderRightButtons()}</div>
    </header>
  );
}
