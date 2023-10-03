import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { TextInput } from 'lego-on-react';
import { FieldWrapper } from '@kamatech-data-ui/common/src';

// import './InputField.scss';

const b = block('dl-connector-input-field');
const DEFAULT_SIZE = 'l';

class InputField extends React.Component {
  static propTypes = {
    valueType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any, // TODO при внедрении TypeScript, решить какой будет тип
    error: PropTypes.string,
    inputType: PropTypes.oneOf(['text', 'password', 'number']),
    widthSize: PropTypes.oneOf(['s', 'm', 'l']),
    hasClear: PropTypes.bool,
    cls: PropTypes.string,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    inputType: 'text',
    widthSize: DEFAULT_SIZE,
    hasClear: true,
  };

  _onChange = value => {
    const { valueType, onChange } = this.props;
    onChange({ [valueType]: value });
  };

  render() {
    const { inputType, value, error, cls, placeholder, widthSize, hasClear } = this.props;

    return (
      <div className={b({ [`width-${widthSize}`]: true }, cls ? cls : '')}>
        <FieldWrapper error={error}>
          <TextInput
            type={inputType}
            theme="normal"
            size="s"
            view="default"
            tone="default"
            text={String(value)}
            placeholder={placeholder}
            onChange={this._onChange}
            hasClear={hasClear}
          />
        </FieldWrapper>
      </div>
    );
  }
}

export default InputField;
