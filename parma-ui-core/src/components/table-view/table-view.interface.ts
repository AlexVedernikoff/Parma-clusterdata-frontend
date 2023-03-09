import {CallbackFunctionArgs, CallbackFunctionArgsReturnAny} from "../../helpers";
import {ScopeType} from "./scope-type.enum";
import {ModeType} from "./mode-type.enum";
import {RowInterface} from "./row/row.interface";

export interface TableViewInterface extends RowInterface {
  /**
   * Массив строк
   */
  entries: any[]

  /**
   * Данные о выбранном entry для выпадающего меню
   */
  currentEntryContext: any
  
  /**
   * Обработчик закрытия выпадающего меню строки
   */
  onCloseEntryContextMenu: CallbackFunctionArgs

  /**
   * Высота строки в списке (для отрисовки компонента List)
   */
  rowHeight: number
}
