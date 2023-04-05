import React, { PureComponent } from 'react';

import block from 'bem-cn-lite';
import { TextInput } from 'lego-on-react';

import { getIconForCast } from '../../utils/helpers';
import Icon from '@parma-data-ui/common/src/components/Icon/Icon';
import Dialog from '@parma-data-ui/common/src/components/Dialog/Dialog';
import { i18n } from '@parma-data-ui/clusterdata';
import Select from '../../../kamatech_modules/lego-on-react/es-modules-src/components/select/select.react';
import update from 'immutability-helper';
import TextArea from '../../../kamatech_modules/lego-on-react/es-modules-src/components/textarea/textarea.react';

const b = block('dialog-filter');

class DialogFormatTemplate extends PureComponent {
  constructor(props) {
    super(props);
    let templateFormat = this.props.item.templateFormat;
    let valueTemplate = '';
    let actionType = '';
    let action = '';
    if (templateFormat) {
      valueTemplate = templateFormat.valueTemplate;
      actionType = templateFormat.actionType;
      action = templateFormat.action;
    }
    let viewFormat = this.props.item.viewFormat;
    this.state = {
      item: this.props.item,
      valueTemplate: valueTemplate,
      actionType: actionType,
      action: action,
      viewFormat: viewFormat,
      visible: this.props.visible,
    };
  }

  onClose = () => {
    const { callback } = this.state;

    this.setState({
      visible: false,
    });

    if (callback) {
      callback(null);
    }
  };

  onCancel = () => {
    const { callback } = this.state;

    this.setState({
      visible: false,
    });

    if (callback) {
      callback(null);
    }
  };

  onApply = () => {
    const { callback } = this.props;
    const { item, valueTemplate, viewFormat, actionType, action } = this.state;

    this.setState({
      visible: false,
    });

    item.templateFormat = {
      valueTemplate: valueTemplate,
      actionType: actionType,
      action: action,
    };

    item.viewFormat = viewFormat;

    if (callback) {
      callback(item);
    }
  };

  loadActionType() {
    return ['None', 'Url'];
  }

  renderBody() {
    const data = this.loadActionType();
    return (
      <div>
        <div className={b('divider')} />
        <div className={b('fields')}>
          <div className={b('row')}>
            <span className={b('label')}>{i18n('wizard', 'Вид события')}</span>
            <div className={b('value custom-text-input')}>
              <Select
                theme="normal"
                size="m"
                view="default"
                tone="default"
                type="radio"
                placeholder="size m"
                width="70"
                val={this.state.actionType}
                options={data}
                onChange={newValue => {
                  this.setState({
                    actionType: newValue[0],
                  });
                }}
              >
                {data.map((actionType, i) => {
                  return (
                    <Select.Item key={`operation-${i}`} val={actionType}>
                      {i18n('wizard', actionType)}
                    </Select.Item>
                  );
                })}
              </Select>
            </div>
          </div>
          <div className={b('row')}>
            <span className={b('label')}>{i18n('wizard', 'Шаблон записи')}</span>
            <div className={b('value custom-text-input')}>
              <TextArea
                theme="normal"
                view="default"
                tone="default"
                size="m"
                text={this.state.valueTemplate}
                onChange={newValue =>
                  this.setState({
                    valueTemplate: newValue,
                  })
                }
                rows={3}
              />
            </div>
          </div>
          <div className={b('row')}>
            <span className={b('label')}>{i18n('wizard', 'Событие')}</span>
            <div className={b('value custom-text-input')}>
              <TextArea
                theme="normal"
                view="default"
                tone="default"
                size="m"
                text={this.state.action}
                onChange={newValue => {
                  this.setState({
                    action: newValue,
                  });
                }}
                rows={3}
              />
            </div>
          </div>
          <div className={b('row')}>
            <span className={b('label')}>{i18n('wizard', 'Формат поля')}</span>
            <div className={b('value custom-text-input')}>
              <TextInput
                theme="normal"
                size="m"
                width="70"
                view="default"
                tone="default"
                hasClear={false}
                pin="round-round"
                text={this.state.viewFormat}
                onChange={newValue => {
                  this.setState({
                    viewFormat: newValue,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    const { item, dataset, updates, callback } = nextProps;
    if (!item || (nextProps.item === this.state.item && callback === this.state.callback)) {
      return;
    }
    let templateFormat = nextProps.item.templateFormat;
    let valueTemplate = '';
    let actionType = '';
    let action = '';
    let viewFormat = nextProps.item.viewFormat;
    if (templateFormat) {
      valueTemplate = templateFormat.valueTemplate;
      actionType = templateFormat.actionType;
      action = templateFormat.action;
    }
    this.setState({
      visible: true,
      valueTemplate,
      actionType,
      action,
      viewFormat: viewFormat || '',
    });
  }

  render() {
    const { item } = this.props;
    const { value } = this.state;

    if (item) {
      const { cast } = item;
      const itemType = item.type.toLowerCase();
      const isDate = cast === 'date' || cast === 'datetime';
      const castIconData = getIconForCast(cast);

      // По умолчанию все валидно
      let valid = true;

      return (
        <Dialog visible={this.state.visible} onClose={this.onClose}>
          <div className={`dialog-filter dialog-filter-${itemType}${isDate ? ' dialog-filter-date' : ''}`}>
            <Dialog.Header caption={item.title} insertBefore={<Icon data={castIconData} width="16" />} />
            <Dialog.Body>{this.renderBody()}</Dialog.Body>
            <Dialog.Footer
              preset="default"
              onClickButtonCancel={this.onCancel}
              onClickButtonApply={this.onApply}
              propsButtonApply={{
                disabled: !valid,
              }}
              textButtonApply={i18n('wizard', 'button_apply')}
              textButtonCancel={i18n('wizard', 'button_cancel')}
              listenKeyEnter
              hr={false}
            />
          </div>
        </Dialog>
      );
    } else {
      return null;
    }
  }
}

export default DialogFormatTemplate;
