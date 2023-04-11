import { CallbackFunctionArgs } from '../../../../helpers';

export interface KamatechCreateDropdownItemInterface {
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
