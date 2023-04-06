import { CallbackFunctionArgsReturnAny, CallbackFunctionArgs } from '../../../helpers';

/**
 * Интерфейс хлебных крошек
 */
export interface ParmaNavigationCrumbInterface {
  /**
   * Флаг, элемент первый
   */
  first: boolean;

  /**
   * Флаг, элемент последний
   */
  last: boolean;

  /**
   * Элемент
   */
  item: any;

  /**
   * Обработчик клика
   */
  onClick?: CallbackFunctionArgs;

  /**
   * Функция для обрамления ссылки
   */
  linkWrapper?: CallbackFunctionArgsReturnAny;
}
