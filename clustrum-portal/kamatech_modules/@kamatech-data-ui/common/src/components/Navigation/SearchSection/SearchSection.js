import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { TextInput } from 'lego-on-react';

// import './SearchSection.scss';

const b = block('yc-navigation-search');

class SearchSection extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    placeholder: 'Поиск',
  };

  refInput = React.createRef();

  focus() {
    this.refInput.current._control.focus();
  }

  _onSearchClick = () => this.focus();

  render() {
    const { text, placeholder, onChange } = this.props;

    return (
      <div className={b()} onClick={this._onSearchClick}>
        <TextInput
          ref={this.refInput}
          view="default"
          tone="default"
          theme="normal"
          size="s"
          hasClear={true}
          placeholder={placeholder}
          text={text}
          onChange={onChange}
        />
      </div>
    );
  }
}

export default SearchSection;
