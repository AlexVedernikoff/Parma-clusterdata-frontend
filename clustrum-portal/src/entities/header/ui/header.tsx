import React from 'react';
import { BreadcrumbWrapper } from './breadcrumb-wrapper/breadcrumb-wrapper';
import { ControlBoardWrapper } from './control-board-wrapper/control-board-wrapper';
import { IHeaderProps } from '../types/IHeaderProps';
import './header.css';

export function Header({ props, actionsBtn, controlBtn }: IHeaderProps): JSX.Element {
  console.log(actionsBtn);

  return (
    <header className={'header'}>
      <BreadcrumbWrapper props={props} actionsBtn={actionsBtn} />
      <ControlBoardWrapper props={props} controlBtn={controlBtn} />
    </header>
  );
}
