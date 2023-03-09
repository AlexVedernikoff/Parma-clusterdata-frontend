import { NodeModel } from '../models';

export class PopupHelper {
  /**
   * Расчет смещения элемента element от базового элемента base
   * @param base
   * @param element
   * @return
   * Возвращает объект offset содержащий значения смещения left, top
   * Учитывает смещения при помощи transform: translate
   */
  static getOffsetElement(base: any, element: any) {
    const offset = { left: 0, top: 0 };
    let el = null;

    // Проверка на равенство
    if (element === base) {
      return offset;
    }

    // Первый проход по иерархии (сбор смещений offsetLeft, offsetTop)
    el = element;
    while (hasNext(base, el)) {
      offset.left += el.offsetLeft;
      offset.top += el.offsetTop;
      el = el.offsetParent;
    }

    // Второй проход по иерархии (сбор смещений transform)
    el = element;
    while (hasNext(base, el)) {
      const style = window.getComputedStyle(el);
      const mat = style.transform.match(/^matrix\((.+)\)$/);
      if (mat != null) {
        const matrix = mat[1].split(', ');
        const tx = parseFloat(matrix[4]);
        const ty = parseFloat(matrix[5]);
        if (isNaN(tx) === false) {
          offset.left += tx;
        }
        if (isNaN(ty) === false) {
          offset.top += ty;
        }
      }
      el = el.parentElement;
    }

    // Еще не дошли до base элемента поднимаясь по иерархии
    function hasNext(base: any, el: any): boolean {
      return el != null && base !== el && PopupHelper.findParent(base, el);
    }

    return offset;
  }

  /**
   * Проверить принадлежность element к parent в иерархии
   * @param parent
   * @param element
   * @return
   * Возвращает true если element === parent или element находиться внутри parent
   * в иерархии
   */
  static findParent(parent: any, element: any): boolean {
    while (element != null) {
      if (element === parent) {
        return true;
      }
      if (element.parentElement == null) {
        break;
      }
      element = element.parentElement;
    }

    return false;
  }

  /**
   * Расчет позиции двух прямоугольников
   * @param base
   * @param element
   * @param borderWidth
   * @param borderHeight
   * @return
   * Возвращает объект offset содержащий значения смещения left, top
   */
  static calcPositionOffset(
    base: NodeModel,
    element: NodeModel,
    borderWidth: number,
    borderHeight: number,
  ): { left: number; top: number } {
    const offset = { left: 0, top: 0 };

    const rightSide = base.left + element.width;
    const leftSide = base.left + base.width - element.width;
    offset.left = rightSide <= borderWidth ? base.left : leftSide;

    const bottomSide = base.top + element.height;
    const topSide = base.top + base.height - element.height;
    offset.top = bottomSide <= borderHeight ? base.top : topSide;

    return offset;
  }
}
