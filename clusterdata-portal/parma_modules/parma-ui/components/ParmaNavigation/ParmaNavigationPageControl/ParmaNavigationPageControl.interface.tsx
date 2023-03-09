import {CallbackFunctionArgs} from "../../../helpers";

export interface ParmaNavigationPageControlInterface {
    /**
     * Текущий номер страницы
     * нумерация начинается с 0
     */
    page: number;

    /**
     * Количество строк на странице, запрашиваемое с сервера
     */
    pageSize: number;

    /**
     * Всего строк
     */
    rowsCount: number;

    /**
     * Фактическое количество строк на странице
     */
    dataLength: number;

    /**
     * Обработчик нажатия на стрелку вперед / назад
     */
    onClick?: CallbackFunctionArgs;

    /**
     * Обработчик изменения состояния компонента
     */
    onStateAndParamsChange?: CallbackFunctionArgs;
}