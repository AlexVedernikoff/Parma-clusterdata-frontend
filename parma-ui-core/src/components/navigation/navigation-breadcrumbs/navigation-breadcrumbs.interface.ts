import { CallbackFunctionArgs, CallbackFunctionArgsReturnAny } from '../../../helpers'

/**
 * Интерфейс хлебных крошек для навигации
 */
export interface NavigationBreadcrumbsInterface {
  /**
   * Размер
   */
  size?: string

  /**
   * Путь
   */
  path?: string

  /**
   * Место
   */
  place?: string

  /**
   * Обработчик клика
   */
  onClick?: CallbackFunctionArgs

  /**
   * Функция для обрамления ссылки
   */
  linkWrapper?: CallbackFunctionArgsReturnAny

  /**
   * Функция получения названия по месту
   */
  getPlaceParameters?: (value: string) => { text: string }
}
