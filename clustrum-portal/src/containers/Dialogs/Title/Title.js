import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { connect } from 'react-redux';

import { CheckBox, TextInput, Tooltip } from 'lego-on-react';
import { Dialog } from '@kamatech-data-ui/common/src';

import HoverRadioButton from './HoverRadioButton/HoverRadioButton';

import { getOpenedItemData, isDialogVisible } from '../../../store/selectors/dash';
import { DIALOG_TYPE } from '../../../modules/constants/constants';
import { closeDialog, setItemData } from '../../../store/actions/dash';

// import './Title.scss';

const SIZES = ['l', 'm', 's', 'xs'];
const RADIO_TEXT = ['Large', 'Medium', 'Small', 'XSmall'];

const b = block('dialog-title');

// TODO: фокус на TextInput

class Title extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    data: PropTypes.shape({
      text: PropTypes.string,
      size: PropTypes.string,
      showInTOC: PropTypes.bool,
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
      text: 'Заголовок',
      size: SIZES[0],
      showInTOC: true,
      ...nextProps.data,
    };
  }

  state = {};

  textRef = React.createRef();

  onApply = () => {
    const { text, size, showInTOC } = this.state;
    if (text.trim()) {
      this.props.setItemData({ data: { text, size, showInTOC } });
      this.props.closeDialog();
    } else {
      this.setState({ error: true });
    }
  };

  render() {
    const { id, visible, closeDialog } = this.props;
    return (
      <Dialog visible={visible} onClose={closeDialog} autoclosable={false}>
        <Dialog.Header caption="Заголовок" />
        <Dialog.Body className={b()}>
          <TextInput
            theme="normal"
            view="default"
            tone="default"
            size="n"
            autoFocus
            onChange={text => this.setState({ text })}
            placeholder="Введите заголовок"
            text={this.state.text}
            mix={{ block: b('input', { size: this.state.size }) }}
            ref={this.textRef}
          />
          <Tooltip
            theme="error"
            view="classic"
            tone="default"
            size="n"
            autoclosable
            visible={this.state.error}
            anchor={this.textRef.current}
            onOutsideClick={() => this.setState({ error: false })}
          >
            Поле должно быть заполнено
          </Tooltip>
          <HoverRadioButton
            onChange={size => this.setState({ size })}
            value={this.state.size}
            values={SIZES}
            radioText={RADIO_TEXT}
          />
          <CheckBox
            theme="normal"
            view="default"
            tone="default"
            size="n"
            checked={this.state.showInTOC}
            onChange={() => this.setState({ showInTOC: !this.state.showInTOC })}
            mix={{ block: b('checkbox') }}
          >
            Отображать в оглавлении
          </CheckBox>
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
  visible: isDialogVisible(state, DIALOG_TYPE.TITLE),
});

const mapDispatchToProps = {
  closeDialog,
  setItemData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Title);
