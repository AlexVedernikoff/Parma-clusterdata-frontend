import React from 'react';

interface PluginTitleProps {
  data: {
    size?: string;
    text?: string;
    showInTOC?: boolean;
  };
}

export const PluginTitle: React.FC<PluginTitleProps> = ({ data }) => {
  const { text = '', size = '', showInTOC = false } = data;
  const id = showInTOC && text ? encodeURIComponent(text) : undefined;

  return <div id={id}>{text}</div>;
};
