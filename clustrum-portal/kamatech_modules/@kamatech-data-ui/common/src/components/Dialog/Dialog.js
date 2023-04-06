import React, { Component } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Modal } from 'lego-on-react';

import DialogFooter from './DialogFooter/DialogFooter';
import DialogHeader from './DialogHeader/DialogHeader';
import DialogBody from './DialogBody/DialogBody';
import DialogDivider from './DialogDivider/DialogDivider';
import ButtonClose from './ButtonClose/ButtonClose';

// import './Dialog.scss';

const b = block('yc-dialog');

class Dialog extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    children: PropTypes.any,
    autoclosable: PropTypes.bool,
    className: PropTypes.string,
    hasButtonClose: PropTypes.bool,
    size: PropTypes.oneOf(['s', 'm', 'l']),
  };

  static defaultProps = {
    autoclosable: true,
    hasButtonClose: true,
  };

  static Footer = DialogFooter;
  static Header = DialogHeader;
  static Body = DialogBody;
  static Divider = DialogDivider;

  onOutsideClick = (...args) => {
    if (this.props.autoclosable) {
      this.props.onClose(...args);
    }
  };

  render() {
    const { children, visible, autoclosable, size, className, hasButtonClose, onClose } = this.props;

    return (
      <Modal autoclosable={autoclosable} visible={visible} onOutsideClick={this.onOutsideClick} cls={b('modal')}>
        <div className={b({ size, 'has-close': hasButtonClose }, className)}>
          {children}
          {hasButtonClose && <ButtonClose onClose={onClose} />}
        </div>
      </Modal>
    );
  }
}

export default Dialog;
