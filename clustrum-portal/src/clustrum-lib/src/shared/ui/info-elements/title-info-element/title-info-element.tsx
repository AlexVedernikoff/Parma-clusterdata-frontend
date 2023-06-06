import React from 'react';
import './title-info-element.css';

export interface TitleInfoElementProps {
  data: {
    text?: string;
    showInTOC?: boolean;
  };
}

function TitleInfoElement(
  { data: { text = '', showInTOC = false } }: TitleInfoElementProps,
  ref: React.Ref<HTMLDivElement>,
): JSX.Element {
  const id = showInTOC && text ? encodeURIComponent(text) : undefined;

  return (
    <div id={id} className="title-info-element">
      <div className={'title-info-element__title'}>{text}</div>
    </div>
  );
}

const PluginTitleWithRef = React.forwardRef<HTMLDivElement, TitleInfoElementProps>(
  TitleInfoElement,
);

export { PluginTitleWithRef as TitleInfoElement };
