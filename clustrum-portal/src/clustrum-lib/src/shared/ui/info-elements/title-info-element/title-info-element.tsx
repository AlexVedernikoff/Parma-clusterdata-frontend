import React from 'react';
import './title-info-element.css';

interface PluginTitleProps {
  data: {
    size?: string;
    text?: string;
    showInTOC?: boolean;
  };
}

export function PluginTitle({ data }: PluginTitleProps): JSX.Element {
  const { text = '', size = '', showInTOC = false } = data;
  const id = showInTOC && text ? encodeURIComponent(text) : undefined;

  return (
    <div id={id} className="title-info-element">
      <div className={'title-info-element__title'}>{text}</div>
    </div>
  );
}
