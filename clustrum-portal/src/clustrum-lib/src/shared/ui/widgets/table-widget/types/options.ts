import { CssStyles } from './css-styles';
import { GridFlow } from './grid-flow';
import { Formatter } from './formatter';

export interface Options {
  precision?: number;
  formatter?: Formatter;
  gridFlow?: GridFlow;
  contentCss?: CssStyles;
}
