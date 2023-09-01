import { CreateMenuActionType } from './create-menu-action-type';
import { NavItemContextMenuClickParams } from './nav-item-context-menu-click-params';

export interface NavigationProps {
  isModalView: boolean;
  showHidden: boolean;
  onCreateMenuClick: (value: CreateMenuActionType) => void;
  onContextMenuClick: (params: NavItemContextMenuClickParams) => Promise<void> | boolean;
  onRetry: () => void;
}
