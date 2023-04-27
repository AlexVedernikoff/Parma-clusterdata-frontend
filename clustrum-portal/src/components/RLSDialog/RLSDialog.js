import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { TextArea } from 'lego-on-react';
import { Dialog } from '@kamatech-data-ui/common/src';

// import './RLSDialog.scss';

const b = block('rls-dialog');

class RLSDialog extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    rlsField: PropTypes.string.isRequired,
    field: PropTypes.object,
  };

  static defaultProps = {
    visible: false,
  };

  state = {
    visible: false,
    rlsField: '',
  };

  static getDerivedStateFromProps(nextProps, nextState) {
    const { rlsField, visible } = nextProps;
    const { visible: visibleState } = nextState;

    if (visible === visibleState) {
      return null;
    }

    return {
      rlsField,
      visible,
    };
  }

  get isSaveBtnDisabled() {
    const { rlsField } = this.props;
    const { rlsField: rlsFieldState } = this.state;

    return rlsField === rlsFieldState;
  }

  saveRls = () => {
    const { field, onSave, onClose } = this.props;
    const { rlsField } = this.state;

    if (field) {
      const { guid } = field;

      onSave({
        [guid]: rlsField,
      });
      onClose();
    }
  };

  changeRlsSettings = rlsField => {
    this.setState({ rlsField });
  };

  render() {
    const { visible, onClose, field } = this.props;
    const { rlsField } = this.state;

    if (!field) {
      return null;
    }

    const { title } = field;

    return (
      <Dialog visible={visible} onClose={onClose}>
        <Dialog.Header caption="Настройка прав доступа для поля" hr={false} onClose={onClose} />
        <Dialog.Body className={b()}>
          <div className={b('field-name')}>
            <span>{title}</span>
          </div>
          <TextArea
            rows={5}
            theme="normal"
            size="s"
            text={rlsField}
            onChange={this.changeRlsSettings}
            placeholder="Формат записи: 'Значение поля': логин1, логин2, etc."
            error={''}
            hasClear
            focused
          />
        </Dialog.Body>
        <Dialog.Footer
          preset="default"
          onClickButtonCancel={onClose}
          onClickButtonApply={this.saveRls}
          textButtonCancel="Отменить"
          textButtonApply="Сохранить"
          progress={false}
          hr={true}
          propsButtonApply={{
            disabled: this.isSaveBtnDisabled,
          }}
        />
      </Dialog>
    );
  }
}

export default RLSDialog;
