import { KamatechIconInterface } from './KamatechIcon.interface';
import { UnitsHelper, CallbackFunctionArgs } from '../../helpers';

/**
 * Модель пиктограммы
 */
export class KamatechIconModel implements KamatechIconInterface {
  constructor({ data, width, height, className, prefix, onClick, fill, stroke }: KamatechIconInterface) {
    this.data = data;
    this.width = width;
    this.height = height;
    this.className = className;
    this.prefix = prefix;
    this.onClick = onClick;
    this.fill = fill || KamatechIconModel.fill;
    this.stroke = stroke || KamatechIconModel.stroke;
  }

  public static fill = 'currentColor';

  public static stroke = 'none';

  public static xmlns = 'http://www.w3.org/2000/svg';

  public static xmlnsXlink = 'http://www.w3.org/1999/xlink';

  data: {
    viewBox: string;
    url?: string;
    id?: string;
  };

  width?: string | number;

  height?: string | number;

  fill?: string;

  stroke?: string;

  className?: string;

  prefix?: string;

  onClick?: CallbackFunctionArgs;

  private readonly WIDTH_INDEX = 2;

  private readonly HEIGHT_INDEX = 3;

  /**
   * Ссылка на элемент/фрагмент,
   */
  get xlinkHref(): string {
    const fragment = this.data.id && `#${this.data.id}`;
    const href = this.data.url || fragment || '';
    return `${this.prefix || ''}${href}`;
  }

  /**
   * Ширина пиктограммы
   */
  get viewWidth(): number {
    return UnitsHelper.convertToNumber(this.width) || this.viewBoxValue(this.WIDTH_INDEX);
  }

  /**
   * Высота пиктограммы
   */
  get viewHeight(): number {
    return UnitsHelper.convertToNumber(this.height) || this.viewBoxValue(this.HEIGHT_INDEX);
  }

  /**
   * Получить значение из viewBox
   * @param index - WIDTH_INDEX или HEIGHT_INDEX
   */
  private viewBoxValue(index: number): number {
    return UnitsHelper.isNullOrUndefined(this.data.viewBox)
      ? 0
      : UnitsHelper.convertToNumber(KamatechIconModel.splitViewBox(this.data.viewBox)[index]);
  }

  /**
   * Парсер viewBox
   * @param viewBox - SVG атрибут  viewBox
   */
  private static splitViewBox(viewBox: string): string[] {
    return (viewBox || '').split(/\s+|\s*,\s*/);
  }
}
