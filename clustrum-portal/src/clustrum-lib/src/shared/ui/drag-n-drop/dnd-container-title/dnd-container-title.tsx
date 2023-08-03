import React from 'react';

import { DndTitleProps } from '../types';

export function DndContainerTitle(props: DndTitleProps): JSX.Element {
  const { title } = props;

  if (!title) {
    return <></>;
  }

  return (
    <div className="subheader dimensions-subheader dimensions-dataset">
      <span> {title}</span>
    </div>
  );
}
