import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import update from 'immutability-helper';
import omit from 'lodash/omit';
import { connect } from 'react-redux';

import { TextInput } from 'lego-on-react';

import { Dialog, Icon } from '@kamatech-data-ui/common/src';

import { getCurrentPageTabs, isDialogVisible } from '../../../store/selectors/dash';
import { closeDialog, setTabs } from '../../../store/actions/dash';
import { DIALOG_TYPE } from '../../../modules/constants/constants';
import DragSortable from '../../../components/DragSortable/DragSortable';

import iconPreviewClose from '@kamatech-data-ui/clustrum/src/icons/preview-close.svg';
import iconPencil from '@kamatech-data-ui/clustrum/src/icons/pencil.svg';
import iconPlus from '@kamatech-data-ui/clustrum/src/icons/plus.svg';

import { i18n } from '@kamatech-data-ui/clustrum';

// import './Tabs.scss';

const b = block('dialog-tabs');
const TAB_TYPE = 'TAB';

class Tabs extends React.PureComponent {
  static propTypes = {
    tabs: PropTypes.array,
    visible: PropTypes.bool.isRequired,
    setTabs: PropTypes.func.isRequired,
    closeDialog: PropTypes.func.isRequired,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.visible === prevState.prevVisible) {
      return null;
    }

    return {
      prevVisible: nextProps.visible,

      tabs: nextProps.tabs,
      editIndex: null,
      editTitle: null,
    };
  }

  state = {
    prevVisible: false,

    tabs: this.props.tabs,
    editIndex: null,
    editTitle: null,
  };

  moveItem = (dragIndex, hoverIndex) => {
    const { tabs } = this.state;
    const dragItem = tabs[dragIndex];

    this.setState({
      tabs: update(tabs, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragItem],
        ],
      }),
    });
  };

  getTempId = () => {
    return `tab${Math.floor(Math.random() * 10 ** 10)}`;
  };

  omitTemp = tabs => {
    return tabs.map(t => omit(t, ['tempId']));
  };

  onCommit = () => {
    const { tabs, editIndex, editTitle } = this.state;
    this.setState({
      tabs: update(tabs, {
        [editIndex]: {
          $merge: { title: editTitle || i18n('dash.tabs-dialog.edit', 'value_default', { index: editIndex + 1 }) },
        },
      }),
      editIndex: null,
      editTitle: null,
    });
  };

  onRemove(id, index) {
    const { tabs } = this.state;
    const tabIndex = tabs.findIndex((tab, i) => (id && tab.id === id) || (index && i === index));
    this.setState({ tabs: update(tabs, { $splice: [[tabIndex, 1]] }) });
  }

  onSave = () => {
    // чтобы успел выполниться onBlur инпута
    setTimeout(() => {
      this.props.setTabs(this.omitTemp(this.state.tabs));
      this.props.closeDialog();
    }, 0);
  };

  render() {
    const { visible, closeDialog } = this.props;
    const { tabs, editIndex, editTitle } = this.state;
    return tabs ? (
      <Dialog visible={visible} onClose={closeDialog} autoclosable={false}>
        <Dialog.Header caption={i18n('dash.tabs-dialog.edit', 'label_tabs')} />
        <Dialog.Body className={b()}>
          <DragSortable type={TAB_TYPE} moveItem={this.moveItem}>
            {tabs.map(({ id, title, tempId }, index) =>
              editIndex === index ? (
                <div className={b('row', { input: true })} key={id || tempId}>
                  <TextInput
                    theme='normal'
                    view='default'
                    tone='default'
                    size='n'
                    autoFocus
                    text={editTitle}
                    onChange={value => this.setState({ editTitle: value })}
                    controlAttrs={{
                      onBlur: this.onCommit,
                      onKeyPress: event => event.charCode === 13 && this.onCommit(),
                    }}
                  />
                </div>
              ) : (
                <div
                  className={b('row')}
                  key={id || tempId}
                  onDoubleClick={() => this.setState({ editIndex: index, editTitle: title })}
                >
                  <div className={b('title')}>{title}</div>
                  <div className={b('controls')}>
                    <Icon
                      className={b('control')}
                      data={iconPencil}
                      width='18'
                      height='18'
                      onClick={() => this.setState({ editIndex: index, editTitle: title })}
                    />
                    {tabs.length > 1 && (
                      <Icon
                        className={b('control')}
                        data={iconPreviewClose}
                        width='18'
                        height='18'
                        onClick={() => this.onRemove(id, index)}
                      />
                    )}
                  </div>
                </div>
              ),
            )}
          </DragSortable>
          <div
            className={b('row', { add: true })}
            onClick={() =>
              this.setState({
                tabs: update(tabs, {
                  $push: [
                    {
                      title: i18n('dash.tabs-dialog.edit', 'value_default', { index: tabs.length + 1 }),
                      // чтобы react dnd работал без ошибок, key должны быть постоянными,
                      // для этого вводим tempId, который будет удален при сохранении
                      tempId: this.getTempId(),
                      items: [],
                      layout: [],
                      ignores: [],
                      aliases: {},
                    },
                  ],
                }),
              })
            }
          >
            <Icon className={b('icon')} data={iconPlus} width='18' height='18' />
            {i18n('dash.tabs-dialog.edit', 'button_add-tab')}
          </div>
        </Dialog.Body>
        <Dialog.Footer
          onClickButtonCancel={closeDialog}
          textButtonApply={i18n('dash.tabs-dialog.edit', 'button_save')}
          textButtonCancel={i18n('dash.tabs-dialog.edit', 'button_cancel')}
          onClickButtonApply={this.onSave}
        />
      </Dialog>
    ) : null;
  }
}

const mapStateToProps = state => ({
  tabs: getCurrentPageTabs(state),
  visible: isDialogVisible(state, DIALOG_TYPE.TABS),
});

const mapDispatchToProps = {
  closeDialog,
  setTabs,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
