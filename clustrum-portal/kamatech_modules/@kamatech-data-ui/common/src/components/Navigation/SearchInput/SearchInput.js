import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'lego-on-react';
import icon from '../../../../../clustrum/src/icons/x-sign.svg';

import { KamatechTextInput } from '@kamatech-ui';

class SearchInput extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
  };

  refInput = React.createRef();

  focus() {
    this.refInput.current.focus();
  }

  render() {
    const { text, placeholder, onChange } = this.props;
    return (
      <div>
        <KamatechTextInput
          ref={this.refInput}
          view="default"
          tone="default"
          theme="normal"
          size="s"
          hasClear={true}
          placeholder={placeholder}
          text={text}
          onChange={onChange}
          iconClearData={icon}
        />
      </div>
    );
  }
}

export default SearchInput;
