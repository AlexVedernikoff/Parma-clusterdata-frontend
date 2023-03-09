import { CallbackFunctionArgs } from '../../helpers'

/**
 * Интерфейс элемента выпадающего списка
 */
export interface CreateDropdownItemInterface {
  /**
   * Иконка
   */
  icon: any

  /**
   * Текст
   */
  text?: string

  /**
   * Значение
   */
  value: any

  /**
   * Обработчик клика
   */
  onClick?: CallbackFunctionArgs
}
