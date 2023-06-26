import { ReactElement } from 'react';

export interface PageContainerProps {
  withoutSidePanel?: boolean;
  withReactRouter?: boolean;
  children?: ReactElement;
}
