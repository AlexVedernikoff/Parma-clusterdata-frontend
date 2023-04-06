import { ControlSize } from '../../../enums';
import { CallbackFunctionArgsReturnAny } from '../../../helpers';

export interface ParmaCreateDropdownInterface {
  size: ControlSize;
  items: any[];
  onMenuClick: CallbackFunctionArgsReturnAny;
}
