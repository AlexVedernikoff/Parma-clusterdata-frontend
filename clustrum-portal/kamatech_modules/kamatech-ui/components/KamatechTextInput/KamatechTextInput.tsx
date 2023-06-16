import * as React from 'react';
import { KamatechTextInputInterface } from './KamatechTextInput.interface';
import { ClassHelper } from '../../helpers';
import { KamatechIcon } from '..';
import './KamatechTextInput.css';
import { KamatechTextInputModel } from './KamatechTextInput.model';

let blockName = 'kamatech-textinput';

type KamatechTextInputState = {
  hovered: boolean;
  focused: boolean;
};

export class KamatechTextInput extends React.Component<
  KamatechTextInputInterface,
  KamatechTextInputState
> {
  constructor(props: KamatechTextInputInterface) {
    super(props);
    this.state = {
      hovered: false,
      focused: false,
    };
    this.onChange = this.onChange.bind(this);
  }

  _control = React.createRef<HTMLInputElement>();

  focus() {
    if (this._control.current) {
      this._control.current.focus();
    }
  }

  onChange = (event: React.SyntheticEvent) => {
    this.props.onChange((event.target as HTMLInputElement).value, event);
  };

  onMouseEnter = (event: React.SyntheticEvent) => {
    this.setState({
      hovered: true,
    });
  };

  onMouseLeave = (event: React.SyntheticEvent) => {
    this.setState({
      hovered: false,
    });
  };

  onMouseDown = (event: React.SyntheticEvent) => {
    this.setState({
      focused: true,
    });
  };

  onMouseOut = (event: React.SyntheticEvent) => {
    this.setState({
      focused: false,
    });
  };

  cleanValue = (event: React.SyntheticEvent) => {
    (event.target as HTMLInputElement).value = '';
    this.focus();
    this.props.onChange((event.target as HTMLInputElement).value, event);
  };

  render() {
    const model = new KamatechTextInputModel(this.props);

    let { theme, view, size, hasClear, tone, type, placeholder } = model;

    let className = ClassHelper.merge(
      `${blockName}_theme_${theme}`,
      `${blockName}_view_${view}`,
      `${blockName}_size_${size}`,
      `${blockName}_has-clear_${hasClear}`,
      `${blockName}_tone_${tone}`,
      `${blockName}_hovered_${this.state.hovered ? 'yes' : 'no'}`,
      `${blockName}_focused_${this.state.focused ? 'yes' : 'no'}`,
    );

    let isClearVisible = model.text == '' ? 'no' : 'yes';

    return (
      <span
        className={className}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onFocus={this.onMouseDown}
        onBlur={this.onMouseOut}
      >
        <input
          ref={this._control}
          type={type}
          placeholder={placeholder}
          value={model.text}
          className={`${blockName}__control`}
          onChange={this.onChange}
        />
        <span className={`${blockName}__box`} />
        {hasClear && model.iconClearData && (
          <span
            className={ClassHelper.merge(
              `${blockName}__clear`,
              `${blockName}__icon`,
              `${blockName}__clear_visible_${isClearVisible}`,
            )}
            onClick={this.cleanValue}
          >
            <KamatechIcon data={model.iconClearData} width={28} height={28} />
          </span>
        )}
      </span>
    );
  }
}
