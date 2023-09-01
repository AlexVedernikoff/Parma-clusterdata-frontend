import { Places } from '@shared/config/routing';
import { CreateMenuActionType } from './create-menu-action-type';

export interface NavigationHeaderProps {
  isModalView: boolean;
  place: Places | null;
  path: string;
  searchValue: string;
  onChangeFilter: (searchValue: string) => void;
  onCreateMenuClick: (value: CreateMenuActionType) => void;
}
