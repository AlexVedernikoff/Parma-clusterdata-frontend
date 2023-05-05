import React from 'react';
import { BreadcrumbWrapper } from './breadcrumb-wrapper/breadcrumb-wrapper';
import './header.css';
import { HeaderProps } from '../types/headerProps';

export function Header({ leftSideContent, rightSideContent, ...props }: HeaderProps): JSX.Element {
  const { entry, rightItems } = props;

  function renderRightButtons(): JSX.Element[] | undefined {
    const buttons = entry ? rightItems : rightSideContent;
    return buttons?.map((item: JSX.Element) => item);
  }

  return (
    <header className={'header'}>
      <BreadcrumbWrapper leftSideContent={leftSideContent} {...props} />

      <div className={'header__action-buttons'}>{renderRightButtons()}</div>
    </header>
  );
}
