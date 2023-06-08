import React from 'react';
import { Breadcrumb } from 'antd';

import './header.css';
import { BreadcrumbItem } from '../types/breadcrumb-item';

export interface HeaderProps {
  path: BreadcrumbItem[];
  title?: string;
  rightSideContent?: JSX.Element;
  leftSideContent?: JSX.Element;
}

export function Header({
  leftSideContent,
  rightSideContent,
  path,
  title,
}: HeaderProps): JSX.Element {
  return (
    <header className="header-wrapper">
      <div className="header-wrapper__breadcrumb">
        <div className="header-wrapper__breadcrumb-patch">
          <Breadcrumb items={path} />
        </div>
      </div>
      <div className="header-wrapper__content">
        <div className="header-wrapper__left-side">
          {title && <div className="header-wrapper__left-side-title">{title}</div>}
          {leftSideContent && (
            <div className="header-wrapper__left-side-content">{leftSideContent}</div>
          )}
        </div>
        <div className="header-wrapper__right-side-content">{rightSideContent}</div>
      </div>
    </header>
  );
}
