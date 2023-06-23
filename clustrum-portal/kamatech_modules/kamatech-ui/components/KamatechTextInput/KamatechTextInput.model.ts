import { KamatechTextInputInterface } from './KamatechTextInput.interface';
import { CallbackFunctionArgs } from '../../helpers';

export class KamatechTextInputModel implements KamatechTextInputInterface {
  constructor(value: KamatechTextInputInterface) {
    const {
      hasClear,
      iconClearData,
      onChange,
      placeholder,
      size,
      text,
      theme,
      tone,
      type,
      view,
    } = value || {};
    this.hasClear = hasClear;
    this.iconClearData = iconClearData;
    this.onChange = onChange;
    this.placeholder = placeholder;
    this.size = size;
    this.text = text;
    this.theme = theme;
    this.tone = tone;
    this.type = type || KamatechTextInputModel.type;
    this.view = view || KamatechTextInputModel.view;
  }

  public static type = 'text';

  public static view = 'classic';

  hasClear: boolean;
  iconClearData: any;
  onChange: CallbackFunctionArgs;
  placeholder: string;
  size: string;
  text: string;
  theme: string;
  tone: string;
  type: string;
  view: string;
}
