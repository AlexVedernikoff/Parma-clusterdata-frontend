import { CallbackFunctionArgs } from '../../../helpers';
import { ParmaRowInterface } from './ParmaRow/ParmaRow.interface';

export interface ParmaTableViewInterface extends ParmaRowInterface {
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
