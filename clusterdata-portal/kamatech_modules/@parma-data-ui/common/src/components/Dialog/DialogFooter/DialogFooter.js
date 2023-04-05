import React, { Component } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
// import './DialogFooter.scss';
import { Button, Tooltip } from 'lego-on-react';

const b = block('yc-dialog-footer');

const getButtonTheme = preset => {
  switch (preset) {
    case 'default':
      return 'action';
    case 'success':
      return 'action';
    case 'danger':
      return 'action';
    default:
      return 'action';
  }
};

class DialogFooter extends Component {
  componentDidMount() {
    if (this.props.listenKeyEnter) {
      this.attachKeyDownListeners();
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.listenKeyEnter && prevProps.listenKeyEnter) {
      this.detachKeyDownListeners();
    }
    if (this.props.listenKeyEnter && !prevProps.listenKeyEnter) {
      this.attachKeyDownListeners();
    }
  }

  componentWillUnmount() {
    this.detachKeyDownListeners();
  }

  attachKeyDownListeners() {
    setTimeout(() => {
      window.addEventListener('keydown', this.handleKeyDown);
    }, 0);
  }

  detachKeyDownListeners() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.props.onClickButtonApply(event);
    }
  };

  elementReference(prefix) {
    return element => {
      if (element === undefined || element === null) {
        return this[prefix];
      }
      this[prefix] = element;
    };
  }

  render() {
    const {
      onClickButtonCancel,
      onClickButtonApply,
      progress,
      textButtonCancel,
      textButtonApply,
      propsButtonCancel,
      propsButtonApply,
      preset,
      children,
      errorText,
      showError,
    } = this.props;

    return (
      <div className={b()}>
        <div className={b('children')}>{children}</div>
        <div className={b('bts-wrapper')}>
          {textButtonCancel && (
            <div className={b('button', { action: 'cancel' })}>
              <Button
                theme="flat"
                width="max"
                tone="default"
                view="default"
                size="n"
                onClick={onClickButtonCancel}
                progress={progress}
                {...propsButtonCancel}
              >
                {textButtonCancel}
              </Button>
            </div>
          )}
          {textButtonApply && (
            <div className={b('button', { action: 'apply' })}>
              <Button
                theme={getButtonTheme(preset)}
                width="max"
                view="default"
                tone="default"
                size="n"
                onClick={onClickButtonApply}
                progress={progress}
                mix={{ block: b('button-apply', { preset }) }}
                ref={this.elementReference('buttonApply')}
                {...propsButtonApply}
              >
                {textButtonApply}
              </Button>
              {errorText && (
                <Tooltip
                  theme="error"
                  visible={showError}
                  anchor={this.elementReference('buttonApply')}
                  to="bottom"
                  size="m"
                >
                  {errorText}
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

DialogFooter.propTypes = {
  preset: PropTypes.oneOf(['default', 'success', 'danger']),
  textButtonCancel: PropTypes.string,
  textButtonApply: PropTypes.string,
  onClickButtonCancel: PropTypes.func,
  onClickButtonApply: PropTypes.func,
  propsButtonCancel: PropTypes.object,
  propsButtonApply: PropTypes.object,
  progress: PropTypes.bool,
  children: PropTypes.any,
  errorText: PropTypes.string,
  showError: PropTypes.bool,
  listenKeyEnter: PropTypes.bool,
};

DialogFooter.defaultProps = {
  preset: 'default',
  showError: false,
  listenKeyEnter: false,
};

export default DialogFooter;
