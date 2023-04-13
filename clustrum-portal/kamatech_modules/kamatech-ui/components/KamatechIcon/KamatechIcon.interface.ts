import { CallbackFunctionArgs } from '../../helpers';

/**
 * Интерфейс пиктограммы
 */
export interface KamatechIconInterface {
  /**
   * Данные пиктограммы
   */
  data: {
    /**
     * Список из четырех чисел min-x, min-y, width и height
     * @link https://developer.mozilla.org/ru/docs/Web/SVG/Attribute/viewBox
     */
    viewBox: string;

    /**
     * URL изображения для пиктограммы
     */
    url?: string;

    /**
     * Идентификатор пиктограммы
     */
    id?: string;
  };

  /**
   * Ширина пиктограммы
   */
  width?: string | number;

  /**
   * Высота пиктограммы
   */
  height?: string | number;

  /**
   * Цвет заливки пиктограммы
   */
  fill?: string;

  /**
   * Цвет обводки
   */
  stroke?: string;

  /**
   * Короткое название класса пиктограммы
   */
  className?: string;

  /**
   * Префикс для xlinkHref
   */
  prefix?: string;

  /**
   * Обработчик нажатия на пиктограмму
   */
  onClick?: CallbackFunctionArgs;
}
