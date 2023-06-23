import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import isEqual from 'lodash/isEqual';

import { Button, Popup } from 'lego-on-react';

// import './DropdownPicker.scss';

const b = block('dropdown-picker');

export default class DropdownPicker extends React.PureComponent {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    items: PropTypes.array.isRequired,
    buttonText: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  state = {
    isOpened: false,
  };

  _onClick = value => {
    this.setState({ isOpened: !this.state.isOpened });
    this.props.onChange(value);
  };

  render() {
    return (
      <div className={b()}>
        <Button
          ref={component => {
            this._buttonComponent = component;
          }}
          theme="normal"
          size="s"
          width="max"
          onClick={() => this.setState({ isOpened: !this.state.isOpened })}
        >
          <div className={b('button-text')}>
            {this.props.buttonText(this.props.value)}
          </div>
        </Button>
        <Popup
          autoclosable
          theme="normal"
          visible={this.state.isOpened}
          anchor={this._buttonComponent}
          directions={['bottom-left', 'bottom-right', 'top-left', 'top-right']}
          onOutsideClick={() => this.setState({ isOpened: false })}
        >
          <div className={b('picker')}>
            {this.props.items.map(({ value, text }, index) => (
              <div
                key={index}
                className={b('item', { selected: isEqual(this.props.value, value) })}
                onClick={() => this._onClick(value)}
              >
                {text}
              </div>
            ))}
          </div>
        </Popup>
      </div>
    );
  }
}
