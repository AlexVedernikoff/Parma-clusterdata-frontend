import React from 'react';
import './control-board-wrapper.css';
import { IHeaderProps } from '../../types/IHeaderProps';

export function ControlBoardWrapper({ props, controlBtn }: IHeaderProps): JSX.Element {
  if (props.entry) {
    return (
      <div className={'header__action-buttons'}>
        {props.rightItems?.length &&
          props.rightItems?.map((RightItems: object) => {
            return RightItems;
          })}
      </div>
    );
  }

  return (
    <div className={'header__action-buttons'}>
      {controlBtn?.map((RightItems: object) => {
        return RightItems;
      })}
    </div>
  );
}
