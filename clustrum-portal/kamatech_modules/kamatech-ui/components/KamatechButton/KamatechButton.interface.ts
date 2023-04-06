import { CallbackFunctionArgs, CallbackFunctionArgsReturnAny } from '../../helpers';
import { ControlSize } from '../../enums';

/**
 * Интерфейс кнопки
 */
export interface KamatechButtonInterface {
  theme: string;
  tone?: string;
  baseline?: boolean;
  size?: ControlSize;
  id?: string;
  name?: string;
  title?: string;
  tabIndex?: number;
  text?: string;
  type?: string;
  iconLeft?: any;
  iconRight?: any;
  onClick?: CallbackFunctionArgs;
  progress?: boolean;
  action?: boolean;
  pale?: boolean;
  checked?: boolean;
  innerRef?: CallbackFunctionArgsReturnAny;
  pressKeys?: any[];
  prvntKeys?: any[];
  view?: string;
  children?: any;
}
