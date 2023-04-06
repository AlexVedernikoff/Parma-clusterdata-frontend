import { ControlSize } from '../../../enums';
import { CallbackFunctionArgsReturnAny } from '../../../helpers';

export interface KamatechCreateDropdownInterface {
  size: ControlSize;
  items: any[];
  onMenuClick: CallbackFunctionArgsReturnAny;
}
