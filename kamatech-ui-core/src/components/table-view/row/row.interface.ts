import { ModeType } from '../mode-type.enum'
import { ScopeType } from '../scope-type.enum'
import { CallbackFunctionArgs, CallbackFunctionArgsReturnAny } from '../../../helpers'

/**
 * Интерфейс строки в навигаторе объектов
 */
export interface RowInterface {
  entry: any

  /**
   * Данные для отрисовки иконки записи
   */
  iconEntry?: any

  /**
   * Данные для отрисовки иконки избранного (отмечено избранным)
   */
  iconFavoriteFilled?: any

  /**
   * Данные для отрисовки иконки избранного (не отмечено избранным)
   */
  iconFavoriteEmpty?: any

  /**
   * Данные для отрисовки иконки выпадающего меню
   */
  iconDots?: any

  /**
   * Данные для отрисовки иконки родительской директории
   */
  iconFolderInline?: any

  /**
   * Флаг, доступность строки для нажатия
   */
  isActive: boolean

  /**
   * Формат отображения строки
   */
  mode: ModeType

  /**
   * Обработчик оборачивания элемента в ссылку для навигации
   */
  linkWrapper: CallbackFunctionArgsReturnAny

  /**
   * Флаг, отображение родительской папки в строке
   */
  displayParentFolder: boolean

  /**
   * Объект, на который можно кликать (для обработки копирования / перемещения объектов в модальном окне)
   */
  clickableScope: ScopeType

  /**
   * Обработчик клика на строку (для навигации в модальном окне)
   */
  onEntryClick: CallbackFunctionArgs

  /**
   * Обработчик клика на меню строки (три точки)
   */
  onEntryContextClick: CallbackFunctionArgs

  /**
   * Обработчик клика на "добавить в избранное"
   */
  onChangeFavorite: CallbackFunctionArgs

  /**
   * Обработчик клика на название родительской папки
   */
  onEntryParentClick: CallbackFunctionArgs
}
