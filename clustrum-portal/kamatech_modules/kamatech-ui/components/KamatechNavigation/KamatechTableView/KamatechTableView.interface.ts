import { CallbackFunctionArgs } from '../../../helpers';
import { KamatechRowInterface } from './KamatechRow/KamatechRow.interface';

export interface KamatechTableViewInterface extends KamatechRowInterface {
  /**
   * Массив строк
   */
  entries: any[];

  /**
   * Данные о выбранном entry для выпадающего меню
   */
  currentEntryContext: any;

  /**
   * Обработчик закрытия выпадающего меню строки
   */
  onCloseEntryContextMenu: CallbackFunctionArgs;

  /**
   * Высота строки в списке (для отрисовки компонента List)
   */
  rowHeight: number;
}
