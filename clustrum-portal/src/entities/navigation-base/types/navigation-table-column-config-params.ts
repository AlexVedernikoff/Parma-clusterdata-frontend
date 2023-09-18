import { NavItemContextMenuClickParams } from './nav-item-context-menu-click-params';
import { ToggleFavoriteParams } from './toggle-favorite-params';

export interface NavigationTableColumnConfigParams {
  handleToggleFavorite: (params: ToggleFavoriteParams) => void;
  onContextMenuClick: (params: NavItemContextMenuClickParams) => Promise<void> | boolean;
}
