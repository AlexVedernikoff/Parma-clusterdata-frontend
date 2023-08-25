import React, { ReactElement } from 'react';
import { Button } from 'antd';
import { NavigationErrorProps } from '@entities/navigation-base/types';

export function NavigationError(props: NavigationErrorProps): ReactElement {
  const { onRetry, error } = props;

  return (
    <div>
      <div>{error}</div>
      <Button size="middle" onClick={onRetry} type="primary">
        Повторить
      </Button>
    </div>
  );
}
