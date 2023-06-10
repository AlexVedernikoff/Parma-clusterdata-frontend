import { ContextMenuActions } from '../../../shared/lib/constants/context-menu-actions';
import { NavigationItem } from '../../../shared/types/navigation-item';

export interface NavItemContextMenuClickParams {
  entry: NavigationItem;
  action: ContextMenuActions;
}
