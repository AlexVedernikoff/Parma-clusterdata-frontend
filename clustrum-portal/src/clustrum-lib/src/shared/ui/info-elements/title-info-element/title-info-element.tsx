import React from 'react';
import './title-info-element.css';

interface TitleInfoElementProps {
  data: {
    text?: string;
    showInTOC?: boolean;
  };
}

export const TitleInfoElement = React.forwardRef<HTMLDivElement, TitleInfoElementProps>(
  (
    { data: { text = '', showInTOC = false } }: TitleInfoElementProps,
    ref: React.Ref<HTMLDivElement>,
  ): JSX.Element => {
    const id = showInTOC && text ? encodeURIComponent(text) : undefined;

    return (
      <div ref={ref} id={id} className="title-info-element">
        <div className={'title-info-element__title'}>{text}</div>
      </div>
    );
  },
);

TitleInfoElement.displayName = 'TitleInfoElement';
