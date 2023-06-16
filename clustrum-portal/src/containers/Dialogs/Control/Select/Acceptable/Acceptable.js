import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Button as LegoButton, TextInput } from 'lego-on-react';
import { Icon } from '@kamatech-data-ui/common/src';

import Button from '../../Switchers/Button';
import Dialog from '../../Dialog/Dialog';

import iconPreviewClose from '@kamatech-data-ui/clustrum/src/icons/preview-close.svg';

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
            placeholder="Добавить значение"
            onChange={newValue => this.setState({ newValue })}
            text={newValue}
            controlAttrs={{
              onBlur: this.addItem,
              onKeyPress: event => event.charCode === 13 && this.addItem(),
            }}
          />
          <LegoButton
            theme="normal"
            view="default"
            tone="default"
            size="s"
            onClick={this.addItem}
          >
            Добавить
          </LegoButton>
        </div>
        <div className={b('items', { empty: isEmpty })}>
          {isEmpty
            ? 'Список пуст'
            : acceptableValues.map((item, index) => (
                <div className={b('item')} key={item}>
                  <span title={item}>{item}</span>
                  <Icon
                    className={b('remove')}
                    data={iconPreviewClose}
                    width="16"
                    onClick={() =>
                      this.setState({
                        acceptableValues: [
                          ...acceptableValues.slice(0, index),
                          ...acceptableValues.slice(index + 1),
                        ],
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
        caption="Возможные значения"
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
          title="Возможные значения"
          text={
            acceptableValues.length
              ? `Значений: ${acceptableValues.length}`
              : 'Не выбрано'
          }
          onClick={() => this.setState({ showDialog: !this.state.showDialog })}
        />
        {this.renderDialog()}
      </React.Fragment>
    );
  }
}

export default Acceptable;
