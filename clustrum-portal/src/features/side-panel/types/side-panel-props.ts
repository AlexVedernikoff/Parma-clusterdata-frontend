import { MenuItemType } from 'antd/es/menu/hooks/useItems';

export interface SidePanelProps {
  withReactRouter?: boolean;
  withHeader?: boolean;
  selectedItem?: string[];
  onClickMenuItem?: (menuItem: MenuItemType) => void;
}
