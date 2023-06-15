import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { TextInput } from 'lego-on-react';

import ClipboardButton from '../ClipboardButton/ClipboardButton';
import ButtonSpin from '../ButtonSpin/ButtonSpin';
import PopupMessage from '../PopupMessage/PopupMessage';

// import './ButtonSpinInput.scss';

const STATUSES = {
  INITIAL: 'initial',
  DONE: 'done',
  FAIL: 'fail',
};

const b = block('button-spin-input');

export default class ButtonSpinInput extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    popup: PropTypes.shape({
      to: PropTypes.string,
      toSide: PropTypes.string,
    }),
    button: PropTypes.shape({
      theme: PropTypes.string,
      size: PropTypes.string,
    }),
  };

  static defaultProps = {
    popup: {},
    button: { theme: 'pseudo', size: 's' },
  };

  state = { status: STATUSES.INITIAL };

  _onClick = () => {
    return this.props
      .onClick()
      .then(text => {
        this._text = text;
        this.setState({ status: STATUSES.DONE });
      })
      .catch(() => this.setState({ status: STATUSES.FAIL }));
  };

  _buttonSpin = () => (
    <div className={b({ 'button-spin': true })}>
      <ButtonSpin
        ref={component => {
          this._buttonComponent = component;
        }}
        theme={this.props.button.theme}
        view="default"
        tone="default"
        size={this.props.button.size}
        text={this.props.text}
        onClick={this._onClick}
      />
      <PopupMessage
        autoclosable
        key="message"
        theme="error"
        size="s"
        anchor={this._buttonComponent}
        to={this.props.popup.to}
        toSide={this.props.popup.toSide}
        visible={this.state.status === STATUSES.FAIL}
        onOutsideClick={() => this.setState({ status: STATUSES.INITIAL })}
      >
        {' '}
        {/* TODO: внутри модального окна не срабатывает / ISL-4096 */}
        Ошибка
      </PopupMessage>
    </div>
  );

  _textInput = () => (
    <div className={b({ 'text-input': true })}>
      <TextInput
        mix={{ block: b, elem: 'item' }}
        theme="normal"
        size="s"
        text={this._text}
      />
      <ClipboardButton className={b('item')} theme="normal" size="s" text={this._text} />
    </div>
  );

  componentWillReceiveProps() {
    this.setState({ status: STATUSES.INITIAL });
  }

  render() {
    const content =
      this.state.status === STATUSES.DONE ? this._textInput() : this._buttonSpin();
    return content;
  }
}
