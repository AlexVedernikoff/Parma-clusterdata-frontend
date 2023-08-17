import { AllowedTypes, CheckAllowed } from './allowed-types';

export type DndDraggedItem<T> = {
  className: string;
  hoverIndex: number;
  index: number;
  data: T;
  containerId: string;
  containerAllowedTypes?: AllowedTypes;
  containerIsNeedRemove?: boolean;
  containerCheckAllowed?: CheckAllowed<T>;
};
