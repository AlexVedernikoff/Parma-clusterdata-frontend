import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Button } from 'lego-on-react';
import i18nFactory from '../../../../../../modules/i18n/i18n';

import Paranja from '../Paranja';

// import './Confirm.scss';

const i18n = i18nFactory('CommentsModal');
const b = block('confirm-paranja');

// TODO: закрытие по Esc, по didMount на document слушать Esc, по willUnmount отвязаться

export default function Confirm(props) {
  return (
    <Paranja visible={props.visible} onClick={props[props.onOutsideClick]}>
      <div className={b()}>
        <div className={b('header')}>{props.text}</div>
        <div className={b('body')}>
          <Button
            theme="action"
            size="m"
            mix={{ block: b('button') }}
            onClick={event => {
              event.stopPropagation();
              props.onConfirm();
            }}
          >
            {props.confirmText || i18n('yes')}
          </Button>
          <Button
            theme="normal"
            size="m"
            mix={{ block: b('button') }}
            onClick={event => {
              event.stopPropagation();
              props.onCancel();
            }}
          >
            {i18n('no')}
          </Button>
        </div>
      </div>
    </Paranja>
  );
}
Confirm.propTypes = {
  visible: PropTypes.bool,
  text: PropTypes.string,
  confirmText: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onOutsideClick: PropTypes.string, // имя функции из props
};
