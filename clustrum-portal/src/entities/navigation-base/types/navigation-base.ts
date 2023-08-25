import { Places } from '@shared/lib/constants';

export interface NavigationBase {
  sdk: any;
  path: string;
  place: Places;
  isModalView?: boolean;
  /**
   * TODO: осталось для обратной совместимости со старым кодом
   * поправить после исправления модалок
   */
  currentPageEntry?: any;
  /**
   * TODO: осталось для обратной совместимости со старым кодом
   * поправить после исправления модалок
   */
  onUpdate?: any;
  updateData: () => void;
}
