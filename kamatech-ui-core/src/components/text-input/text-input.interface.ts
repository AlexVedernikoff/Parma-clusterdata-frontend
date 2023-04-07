import {CallbackFunctionArgs} from "../../helpers";

export interface TextInputInterface {
  /**
   * Подсказка в строке ввода
   */
  placeholder: string
  
  /**
   * Введенный текст
   */
  text: string

  /**
   * Данные для отрисовки иконки стирания текста
   */
  iconClearData: any

  /**
   * Обработчик изменения текста
   */
  onChange: CallbackFunctionArgs

  /**
   * Флаг, кнопка стирания текста
   */
  hasClear: boolean

  /**
   * Тип компонента
   */
  type: string
  
  /**
   * Размер компонента
   */
  size: string

  /**
   * Тема компонента
   */
  theme: string

  /**
   * Тон компонента
   */
  tone: string

  /**
   * Вид компонента
   */
  view: string
}
