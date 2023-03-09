import { CallbackFunctionArgsReturnAny, CallbackFunctionArgs } from '../../../helpers';

/**
 * Интерфейс бокового меню
 */
export interface ParmaSidebarInterface {
  /**
   * Путь
   */
  path?: string;

  /**
   * Текущий путь
   */
  currentPlace?: string;

  /**
   * Массив элементов
   */
  quickItems?: any[];

  /**
   * Функция для обрамления ссылки
   */
  linkWrapper?: CallbackFunctionArgsReturnAny;

  /**
   * Обработчик клика
   */
  onItemClick?: CallbackFunctionArgs;

  /**
   * Функция запроса параметров
   */
  getPlaceParameters: CallbackFunctionArgsReturnAny;
}
