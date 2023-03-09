import { CallbackFunctionArgsReturnAny, CallbackFunctionArgs } from '../../../../helpers';

/**
 * Интерфейс элемента бокового меню
 */
export interface ParmaSidebarItemInterface {
  /**
   * Элемент
   */
  item: any;

  /**
   * Флаг, текущий элемент
   */
  current?: boolean;

  /**
   * Функция для обрамления ссылки
   */
  linkWrapper?: CallbackFunctionArgsReturnAny;

  /**
   * Обработчик клика
   */
  onClick?: CallbackFunctionArgs;
}
