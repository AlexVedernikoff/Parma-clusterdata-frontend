import { CssStyles, GridFlow } from '.';
import { Formatter } from './formatter';

export interface Options {
  precision?: number;
  formatter?: Formatter;
  gridFlow?: GridFlow;
  contentCss?: CssStyles;
}
