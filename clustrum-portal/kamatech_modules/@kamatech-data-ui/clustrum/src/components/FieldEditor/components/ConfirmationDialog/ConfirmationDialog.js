import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Button } from 'lego-on-react';
import { Dialog } from '@kamatech-data-ui/common/src';
//import './ConfirmationDialog.scss';

const b = block('confirmation-dialog');

class ConfirmationDialog extends React.Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    cancel: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
  };

  render() {
    const { isVisible, cancel, confirm } = this.props;

    return (
      <Dialog visible={isVisible} onClose={cancel} hasButtonClose={false}>
        <div className={b('confirm-popup')}>
          <div className={b('confirm-question')}>
            <span>Вы уверены что хотите выйти?</span>
            <span>Данные будут утеряны</span>
          </div>
          <div className={b('confirm-btns')}>
            <Button
              cls={b('no-btn')}
              size="m"
              theme="flat"
              view="default"
              tone="default"
              text="Нет"
              onClick={cancel}
            />
            <Button
              cls={b('yes-btn')}
              size="m"
              theme="action"
              view="default"
              tone="default"
              text="Да"
              onClick={confirm}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

export default ConfirmationDialog;
