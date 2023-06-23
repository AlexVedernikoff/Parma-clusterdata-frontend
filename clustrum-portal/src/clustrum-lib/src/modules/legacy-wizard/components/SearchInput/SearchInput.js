import React, { PureComponent } from 'react';
import block from 'bem-cn-lite';
import { TextInput } from 'lego-on-react';

// import './SearchInput.scss';

const b = block('custom-text-input');

class SearchInput extends PureComponent {
  static defaultProps = {};

  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = {
      focus: false,
    };

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus() {
    if (this.props.borderDisabled) {
      this.setState({
        focus: true,
      });
    }
  }

  onBlur() {
    if (this.props.borderDisabled) {
      this.setState({
        focus: false,
      });
    }
  }

  render() {
    const {
      theme = 'normal',
      size = 's',
      pin = 'round-round',
      type = 'text',
      text = '',
      placeholder = '',
      className = '',
      hasClear = false,
      LeftIcon,
      borderDisabled = true,
      autocomplete = false,
      dataName,
      dataGuid,
      onChange = null,
    } = this.props;

    const customClass = {
      borderDisabled,
      focus: this.state.focus,
    };

    return (
      <div
        data-name={dataName}
        data-guid={dataGuid}
        className={b(customClass, className)}
      >
        {LeftIcon}
        <TextInput
          autocomplete={autocomplete}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          ref={ref => {
            this._textInput = ref;
          }}
          type={type}
          theme={theme}
          size={size}
          pin={pin}
          text={text}
          placeholder={placeholder}
          hasClear={hasClear}
          onChange={onChange}
        />
      </div>
    );
  }
}

export default SearchInput;
