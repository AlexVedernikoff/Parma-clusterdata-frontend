import React from 'react';
import { Breadcrumb, Tooltip } from 'antd';
import { HeaderProps } from '../types';

import './header.css';

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
          {title && (
            <div className="header-wrapper__left-side-title">
              {/* <Tooltip placement="bottomRight" arrow={false} title={title}> */}

              {title}

              {/* </Tooltip> */}
            </div>
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
