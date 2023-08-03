import { Places } from '@shared/lib/constants';
import { CreateMenuActionType } from '../lib/constants';

export interface NavigationHeaderProps {
  isModalView: boolean;
  place: Places | null;
  path: string;
  searchValue: string;
  onChangeFilter: (searchValue: string) => void;
  onCreateMenuClick: (value: CreateMenuActionType) => void;
}
