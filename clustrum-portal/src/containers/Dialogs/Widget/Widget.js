import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import update, { extend } from 'immutability-helper';
import { connect } from 'react-redux';
import mergeWith from 'lodash/mergeWith';

import { TextArea, TextInput, Tooltip, Button } from 'lego-on-react';
import { Dialog, Icon } from '@kamatech-data-ui/common/src';

import TabMenu from './TabMenu/TabMenu';
import NavigationInput from '../../../components/NavigationInput/NavigationInput';
import ButtonIcon from '../../../components/ButtonIcon/ButtonIcon';

import { getOpenedItemData, isDialogVisible } from '../../../store/selectors/dash';
import { DIALOG_TYPE, IS_INTERNAL } from '../../../modules/constants/constants';
import { closeDialog, setItemData } from '../../../store/actions/dash';
import { ENTRY_TYPE } from '../../../constants/constants';

import iconPlus from '@kamatech-data-ui/clustrum/src/icons/plus.svg';
import iconPreviewClose from '@kamatech-data-ui/clustrum/src/icons/preview-close.svg';

import { i18n } from '@kamatech-data-ui/clustrum';
import CheckBox from '../Control/Switchers/CheckBox';

// import './Widget.scss';

extend('$auto', (value, object) => (object ? update(object, value) : update({}, value)));

const b = block('widget-item-dialog');

function Line(props) {
  return (
    <div className={b('line', props.className)}>
      <div className={b('line-caption')}>{props.caption}</div>
      <div className={b('line-content')}>{props.children}</div>
    </div>
  );
}

function Param({ name, value, onRemove }) {
  if (Array.isArray(value)) {
    return (
      <React.Fragment>
        {value.map(val => (
          <Param key={name + val} name={name} value={val} onRemove={onRemove} />
        ))}
      </React.Fragment>
    );
  }
  return (
    <span className={b('param')}>
      <span className={b('param-text')}>{`${name}=${value}`}</span>
      <Icon
        className={b('param-icon')}
        data={iconPreviewClose}
        width='20'
        height='20'
        onClick={() => onRemove(name, value)}
      />
    </span>
  );
}

function wrapToArray(value) {
  return Array.isArray(value) ? value : [value];
}

// TODO: проставлять в defaultPath навигации key из entry

class Widget extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        data: PropTypes.object.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        isDisplayOnlyWithFilter: PropTypes.bool,
      }),
    ),
    visible: PropTypes.bool.isRequired,
    closeDialog: PropTypes.func.isRequired,
    setItemData: PropTypes.func.isRequired,
  };

  static defaultProps = {
    data: [
      {
        data: {},
        description: '',
        get title() {
          return i18n('dash.widget-dialog.edit', 'value_title-default', { index: 1 });
        },
      },
    ],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.visible === prevState.prevVisible) {
      return null;
    }

    return {
      prevVisible: nextProps.visible,
      error: false,
      data: nextProps.data,
      tabIndex: 0,
      tabDefault: 0,
      showParamsDialog: false,
      isManualTitle: Boolean(nextProps.id),
      paramKey: '',
      paramValue: '',
    };
  }

  state = {};

  navigationInputRef = React.createRef();

  get isEdit() {
    return Boolean(this.props.id);
  }

  onApply = () => {
    const { data } = this.state;
    const tabIndex = data.findIndex(({ data: { uuid } }) => !uuid);
    if (tabIndex === -1) {
      this.props.setItemData({
        data: data.map(({ title, ...rest }, index) => ({
          title: title.trim() || i18n('dash.widget-dialog.edit', 'value_title-default', { index: index + 1 }),
          ...rest,
        })),
      });
      this.props.closeDialog();
    } else {
      this.setState({ error: true, tabIndex });
    }
  };

  _onAddWidget = ({ entryId, name, params = {} }) => {
    const { data, tabIndex, isManualTitle } = this.state;

    if (!IS_INTERNAL) {
      params = {};
    }

    if (isManualTitle) {
      this.setState({
        data: update(data, {
          [tabIndex]: {
            data: {
              uuid: { $set: entryId },
              params: { $auto: { $merge: params } },
            },
          },
        }),
      });
    } else {
      this.setState({
        data: update(data, {
          [tabIndex]: {
            title: { $set: name },
            data: {
              uuid: { $set: entryId },
              params: { $auto: { $merge: params } },
            },
          },
        }),
      });
    }
  };

  _updateTabMenu = ({ items, itemChosen, itemDefault }) => {
    this.setState({
      data: items,
      tabIndex: itemChosen,
      tabDefault: itemDefault,
      error: false,
      isManualTitle: this.isEdit,
    });
  };

  closeParamsDialog = () => this.setState({ showParamsDialog: false, paramKey: '', paramValue: '' });

  addParam = () => {
    const { data, tabIndex, paramKey, paramValue } = this.state;

    const params = data[tabIndex].data.params;

    this.setState({
      data: update(data, {
        [tabIndex]: {
          data: {
            params: {
              $set: mergeWith({}, params, { [paramKey]: paramValue }, (objValue, srcValue) => {
                if (objValue) {
                  return wrapToArray(objValue).concat(wrapToArray(srcValue));
                }
                return undefined;
              }),
            },
          },
        },
      }),
    });
    this.closeParamsDialog();
  };

  removeParam = (paramKey, paramValue) => {
    const { data, tabIndex } = this.state;

    const params = data[tabIndex].data.params;

    this.setState({
      data: update(data, {
        [tabIndex]: {
          data: {
            params: {
              $set: Object.entries(params).reduce((result, [key, value]) => {
                if (key === paramKey) {
                  const newValue = wrapToArray(value).filter(value => value !== paramValue);
                  if (newValue.length) {
                    result[key] = newValue;
                  }
                } else {
                  result[key] = value;
                }
                return result;
              }, {}),
            },
          },
        },
      }),
    });
  };

  renderParamsDialog() {
    const { showParamsDialog, paramKey, paramValue } = this.state;

    if (!showParamsDialog) {
      return null;
    }

    return (
      <Dialog visible={this.state.showParamsDialog} onClose={this.closeParamsDialog} autoclosable={false}>
        <Dialog.Header caption={i18n('dash.widget-dialog.edit', 'label_new-param')} />
        <Dialog.Body className={b('dialog-params')}>
          <div className={b('dialog-params-row')}>
            {i18n('dash.widget-dialog.edit', 'field_param-name')}
            <TextInput
              theme='normal'
              view='default'
              tone='default'
              size='s'
              text={paramKey}
              onChange={paramKey => this.setState({ paramKey })}
            />
          </div>
          <div className={b('dialog-params-row')}>
            {i18n('dash.widget-dialog.edit', 'field_param-value')}
            <TextInput
              theme='normal'
              view='default'
              tone='default'
              size='s'
              text={paramValue}
              onChange={paramValue => this.setState({ paramValue })}
            />
          </div>
        </Dialog.Body>
        <Dialog.Footer
          onClickButtonCancel={this.closeParamsDialog}
          textButtonApply={i18n('dash.widget-dialog.edit', 'button_add')}
          textButtonCancel={i18n('dash.widget-dialog.edit', 'button_cancel')}
          onClickButtonApply={this.addParam}
        />
      </Dialog>
    );
  }

  renderParams() {
    const { data, tabIndex } = this.state;

    const {
      data: { params = {} },
    } = data[tabIndex];

    if (IS_INTERNAL) {
      return (
        <React.Fragment>
          <Line caption={i18n('dash.widget-dialog.edit', 'field_params')}>
            <Button
              theme='flat'
              view='default'
              tone='default'
              size='s'
              onClick={() => this.setState({ showParamsDialog: true })}
            >
              <ButtonIcon>
                <Icon data={iconPlus} width='16' />
              </ButtonIcon>
              {i18n('dash.widget-dialog.edit', 'button_add-param')}
            </Button>
          </Line>
          {this.renderParamsDialog()}
          <div className={b('params', { empty: !Object.keys(params).length })}>
            {Object.keys(params).length
              ? Object.entries(params).map(([key, value]) => (
                  <Param key={key + value} name={key} value={value} onRemove={this.removeParam} />
                ))
              : i18n('dash.widget-dialog.edit', 'label_empty-list')}
          </div>
        </React.Fragment>
      );
    }

    return null;
  }

  render() {
    const { visible, closeDialog } = this.props;
    const { data, tabIndex, tabDefault } = this.state;

    const {
      title,
      data: { uuid },
      description,
    } = data[tabIndex];

    return (
      <Dialog visible={visible} onClose={closeDialog} autoclosable={false}>
        <div className={b()}>
          <Dialog.Header caption={i18n('dash.widget-dialog.edit', 'label_widget')} />
          <Dialog.Body>
            <div className={b('main')}>
              <div className={b('sidebar')}>
                <TabMenu items={data} itemChosen={tabIndex} itemDefault={tabDefault} update={this._updateTabMenu} />
              </div>

              <div className={b('content')}>
                <Line caption={i18n('dash.widget-dialog.edit', 'field_title')}>
                  <TextInput
                    theme='normal'
                    view='default'
                    tone='default'
                    size='s'
                    placeholder={i18n('dash.widget-dialog.edit', 'context_fill-title')}
                    text={title}
                    onChange={value =>
                      this.setState({
                        isManualTitle: true,
                        data: update(data, { [tabIndex]: { title: { $set: value } } }),
                      })
                    }
                  />
                </Line>

                <Line caption={i18n('dash.widget-dialog.edit', 'field_widget')} className={b('line-widget')}>
                  <NavigationInput
                    size='s'
                    entryId={uuid}
                    onChange={this._onAddWidget}
                    excludeClickableType={ENTRY_TYPE.CONTROL_NODE}
                    ref={this.navigationInputRef}
                  />
                  <Tooltip
                    theme='error'
                    view='classic'
                    tone='default'
                    size='n'
                    autoclosable
                    visible={this.state.error}
                    anchor={this.navigationInputRef.current}
                    onOutsideClick={() => setTimeout(() => this.setState({ error: false }), 0)}
                  >
                    {i18n('dash.widget-dialog.edit', 'toast_required-field')}
                  </Tooltip>
                </Line>

                <Line caption={i18n('dash.widget-dialog.edit', 'field_description')} />
                <TextArea
                  theme='normal'
                  view='default'
                  tone='default'
                  size='s'
                  text={description}
                  placeholder={i18n('dash.widget-dialog.edit', 'context_fill-description')}
                  onChange={value =>
                    this.setState({
                      data: update(data, {
                        [tabIndex]: { description: { $set: value } },
                      }),
                    })
                  }
                  rows={3}
                />

                <CheckBox
                  text={i18n('dash.widget-dialog.edit', 'is_display_only_with_filter')}
                  checked={this.state.data[tabIndex].isDisplayOnlyWithFilter}
                  onChange={() => {
                    const { data, tabIndex } = this.state;
                    this.setState(prevState => ({
                      data: update(data, {
                        [tabIndex]: {
                          isDisplayOnlyWithFilter: { $set: !prevState.data[tabIndex].isDisplayOnlyWithFilter },
                        },
                      }),
                    }));
                  }}
                />

                {this.renderParams()}
              </div>
            </div>
          </Dialog.Body>
          <Dialog.Footer
            onClickButtonCancel={closeDialog}
            onClickButtonApply={this.onApply}
            textButtonApply={
              this.isEdit
                ? i18n('dash.widget-dialog.edit', 'button_save')
                : i18n('dash.widget-dialog.edit', 'button_add')
            }
            textButtonCancel={i18n('dash.widget-dialog.edit', 'button_cancel')}
          />
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  id: state.dash.openedItemId,
  data: getOpenedItemData(state),
  visible: isDialogVisible(state, DIALOG_TYPE.WIDGET),
});

const mapDispatchToProps = {
  closeDialog,
  setItemData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Widget);
