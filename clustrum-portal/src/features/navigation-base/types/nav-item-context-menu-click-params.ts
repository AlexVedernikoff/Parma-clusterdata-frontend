import { ContextMenuActions } from '@shared/lib/constants';
import { NavigationItem } from '@shared/types';

export interface NavItemContextMenuClickParams {
  entry: NavigationItem;
  action: ContextMenuActions;
}
