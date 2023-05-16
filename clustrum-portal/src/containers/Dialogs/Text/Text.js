import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { connect } from 'react-redux';

import { TextArea } from 'lego-on-react';
import { Dialog, FieldWrapper } from '@kamatech-data-ui/common/src';

import { DIALOG_TYPE } from '../../../modules/constants/constants';
import { isDialogVisible, getOpenedItemData } from '../../../store/selectors/dash';
import { closeDialog, setItemData } from '../../../store/actions/dash';

// import './Text.scss';

const b = block('dialog-text');

class Text extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    data: PropTypes.shape({
      text: PropTypes.string,
    }),
    visible: PropTypes.bool.isRequired,
    closeDialog: PropTypes.func.isRequired,
    setItemData: PropTypes.func.isRequired,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.visible === prevState.prevVisible) {
      return { error: prevState.error && !prevState.text };
    }

    return {
      prevVisible: nextProps.visible,
      error: false,
      text: '',
      ...nextProps.data,
    };
  }

  state = {};

  onApply = () => {
    const { text } = this.state;
    if (text.trim()) {
      this.props.setItemData({ data: { text } });
      this.props.closeDialog();
    } else {
      this.setState({ error: true });
    }
  };

  render() {
    const { id, visible, closeDialog } = this.props;
    return (
      <Dialog visible={visible} onClose={closeDialog} autoclosable={false}>
        <Dialog.Header caption="Текст" />
        <Dialog.Body className={b()}>
          <FieldWrapper error={this.state.error ? 'Поле должно быть заполнено' : null}>
            <TextArea
              theme="normal"
              view="default"
              tone="default"
              size="m"
              text={this.state.text}
              placeholder="Введите текст"
              rows={8}
              cls={b('textarea')}
              onChange={text => this.setState({ text })}
            />
          </FieldWrapper>
        </Dialog.Body>
        <Dialog.Footer
          onClickButtonCancel={closeDialog}
          onClickButtonApply={this.onApply}
          textButtonApply={id ? 'Сохранить' : 'Добавить'}
          textButtonCancel="Отменить"
        />
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  id: state.dash.openedItemId,
  data: getOpenedItemData(state),
  visible: isDialogVisible(state, DIALOG_TYPE.TEXT),
});

const mapDispatchToProps = {
  closeDialog,
  setItemData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Text);
