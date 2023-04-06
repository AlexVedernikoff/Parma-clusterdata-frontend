import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Button as LegoButton, TextInput } from 'lego-on-react';
import { Icon } from '@kamatech-data-ui/common/src';

import Button from '../../Switchers/Button';
import Dialog from '../../Dialog/Dialog';

import iconPreviewClose from '@kamatech-data-ui/clustrum/src/icons/preview-close.svg';

import { i18n } from '@kamatech-data-ui/clustrum';

// import './Acceptable.scss';

const b = block('select-acceptable');

class Acceptable extends React.PureComponent {
  static propTypes = {
    acceptableValues: PropTypes.array,
    multiselectable: PropTypes.bool,
    onApply: PropTypes.func.isRequired,
  };

  state = {
    showDialog: false,
    newValue: '',
    acceptableValues: this.props.acceptableValues,
  };

  addItem = () => {
    const { newValue, acceptableValues } = this.state;
    if (newValue.trim() !== '' && !acceptableValues.includes(newValue)) {
      this.setState({ newValue: '', acceptableValues: [newValue, ...acceptableValues] });
    }
  };

  renderBody() {
    const { newValue, acceptableValues } = this.state;
    const isEmpty = !acceptableValues.length;
    return (
      <React.Fragment>
        <div className={b('header')}>
          <TextInput
            theme="normal"
            view="default"
            tone="default"
            placeholder={i18n('dash.control-dialog.edit', 'context_add-value')}
            onChange={newValue => this.setState({ newValue })}
            text={newValue}
            controlAttrs={{
              onBlur: this.addItem,
              onKeyPress: event => event.charCode === 13 && this.addItem(),
            }}
          />
          <LegoButton theme="normal" view="default" tone="default" size="s" onClick={this.addItem}>
            {i18n('dash.control-dialog.edit', 'button_add')}
          </LegoButton>
        </div>
        <div className={b('items', { empty: isEmpty })}>
          {isEmpty
            ? i18n('dash.control-dialog.edit', 'label_empty-list')
            : acceptableValues.map((item, index) => (
                <div className={b('item')} key={item}>
                  <span title={item}>{item}</span>
                  <Icon
                    className={b('remove')}
                    data={iconPreviewClose}
                    width="16"
                    onClick={() =>
                      this.setState({
                        acceptableValues: [...acceptableValues.slice(0, index), ...acceptableValues.slice(index + 1)],
                      })
                    }
                  />
                </div>
              ))}
        </div>
      </React.Fragment>
    );
  }

  renderDialog() {
    const { onApply } = this.props;
    const { showDialog, acceptableValues } = this.state;
    return (
      <Dialog
        visible={showDialog}
        caption={i18n('dash.control-dialog.edit', 'label_acceptable-values')}
        onApply={() => {
          onApply({ acceptableValues });
          this.setState({
            showDialog: false,
            newValue: '',
          });
        }}
        onClose={() =>
          this.setState({
            showDialog: false,
            newValue: '',
            acceptableValues: this.props.acceptableValues,
          })
        }
      >
        {this.renderBody()}
      </Dialog>
    );
  }

  render() {
    const { acceptableValues } = this.props;
    return (
      <React.Fragment>
        <Button
          title={i18n('dash.control-dialog.edit', 'field_acceptable-values')}
          text={
            acceptableValues.length
              ? i18n('dash.control-dialog.edit', 'value_select-values', { count: acceptableValues.length })
              : i18n('dash.control-dialog.edit', 'value_not-chosen')
          }
          onClick={() => this.setState({ showDialog: !this.state.showDialog })}
        />
        {this.renderDialog()}
      </React.Fragment>
    );
  }
}

export default Acceptable;
