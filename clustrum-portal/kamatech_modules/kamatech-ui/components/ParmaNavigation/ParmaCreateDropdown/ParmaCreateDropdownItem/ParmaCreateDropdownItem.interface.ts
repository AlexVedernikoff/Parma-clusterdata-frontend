import { CallbackFunctionArgs } from '../../../../helpers';

export interface ParmaCreateDropdownItemInterface {
  /**
   * Иконка
   */
  icon: any;

  /**
   * Текст
   */
  text?: string;

  /**
   * Значение
   */
  value: any;

  /**
   * Обработчик клика
   */
  onClick?: CallbackFunctionArgs;
}
