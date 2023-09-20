import React from 'react';
import { TitleInfoElementProps } from './types';

import './title-info-element.css';

export const TitleInfoElement = React.forwardRef<HTMLDivElement, TitleInfoElementProps>(
  (
    { data: { text = '', showInTOC = false, size = 'l' } }: TitleInfoElementProps,
    ref: React.Ref<HTMLDivElement>,
  ): JSX.Element => {
    const id = showInTOC && text ? encodeURIComponent(text) : undefined;

    return (
      <div ref={ref} id={id} className="title-info-element">
        <div className={`title-info-element__title_${size}`}>{text}</div>
      </div>
    );
  },
);

TitleInfoElement.displayName = 'TitleInfoElement';
