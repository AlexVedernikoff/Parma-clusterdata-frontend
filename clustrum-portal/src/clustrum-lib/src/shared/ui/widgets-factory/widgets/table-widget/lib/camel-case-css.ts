import { CssStyles } from '../types';

export function camelCaseCss(style: CssStyles = {}): CssStyles {
  return Object.keys(style).reduce((result, key) => {
    const camelCasedKey = key.replace(/-(\w|$)/g, (_, char) => char.toUpperCase());
    result[camelCasedKey] = style[key];
    return result;
  }, {} as CssStyles);
}
