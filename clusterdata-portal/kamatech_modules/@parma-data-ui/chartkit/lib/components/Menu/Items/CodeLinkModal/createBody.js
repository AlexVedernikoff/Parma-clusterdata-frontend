import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { TextArea, CheckBox, RadioBox } from 'lego-on-react';
import i18nFactory from '../../../../modules/i18n/i18n';

import ClipboardButton from '../ClipboardButton/ClipboardButton';
import URI from '../../../../modules/uri/uri';
import TinyUrlButton from '../TinyUrlButton/TinyUrlButton';

/**
 * @param {Object}   config
 * @param {String}   [config.header] - заголовок
 * @param {String}   [config.text] - описание
 * @param {Boolean}  [config.shortLinkItem] - есть ли кнопка "Получить короткую ссылку"
 * @param {Boolean}  [config.toggleInterval] - есть ли переключатель интервала
 * @param {Boolean}  [config.toggleVisible] - есть ли переключатель видимости
 * @param {Object[]} [config.checkboxes] - массив конфигов checkbox-ов
 * @param {String}      config.checkboxes[].key - ключ checkbox-а
 * @param {String}      config.checkboxes[].text - заголовок checkbox-а
 * @param {Boolean}     config.checkboxes[].checked - отмечен ли checkbox
 * @param {Boolean}     config.checkboxes[].queryParam - используется ли checkbox в формировании URL'а
 * @param {Object[]} [config.radiobox] - массив конфигов radiobox-ов
 * @param {String}      config.radiobox[].width - предлагаемая ширина в radiobox-е
 * @param {String}      config.radiobox[].height - предлагаемая высота в radiobox-е
 * @param {Function} [config.format] - функция (config, state, pathURI) дополнительно преобразует URL
 *
 * @returns {React.PureComponent}
 */

const i18n = i18nFactory('CodeLinkModal');
const b = block('code-link-modal');

export default function createBody(config) {
  config.checkboxes = config.checkboxes || [];
  config.radiobox = config.radiobox || [];

  const hasCheckboxes = () => config.checkboxes.length > 0;
  const hasRadioBox = () => config.radiobox.length > 0;

  return class CodeLinkModalBody extends React.PureComponent {
    static propTypes = {
      url: PropTypes.string.isRequired, // url для преобразования
    };

    constructor(props) {
      super(props);

      this.pathURI = new URI(this.props.url);

      const state = {};

      config.checkboxes.forEach(checkbox => {
        state[checkbox.key] = checkbox.checked;
      });

      if (hasRadioBox()) {
        state.radiobox = 0;
      }

      this.state = state;
    }

    // TODO: нельзя выбрать ранее выбранный radio / github.com/facebook/react/issues/9988
    _radiobox = () => (
      <div className={b('row', { common: true, radiobox: true })}>
        <span className={b('cell', { flex: 'zero', inline: true })}>{i18n('size-width-height')}:</span>
        <span className={b('cell', { inline: true })}>
          <RadioBox
            theme="normal"
            size="s"
            value={this.state.radiobox}
            name="radiobox"
            onChange={event => this.setState({ radiobox: Number(event.target.value) })}
          >
            {config.radiobox.map((size, index) => (
              <RadioBox.Radio value={index} key={index} mix={{ block: b('radio') }}>
                {`${size.width} / ${size.height}`}
              </RadioBox.Radio>
            ))}
          </RadioBox>
        </span>
      </div>
    );

    _checkboxes = () => (
      <div className={b('row', { common: true, column: true })}>
        {config.checkboxes.map((checkbox, index) => {
          return (
            <div className={b('cell', { common: index !== 0 })} key={checkbox.key}>
              <CheckBox
                theme="normal"
                size="s"
                checked={this.state[checkbox.key]}
                onChange={() => this.setState({ [checkbox.key]: !this.state[checkbox.key] })}
              >
                {checkbox.text}
              </CheckBox>
            </div>
          );
        })}
      </div>
    );

    _tinyUrlButton = url => (
      <div className={b('row', { common: true })}>
        <TinyUrlButton url={url} />
      </div>
    );

    render() {
      const self = this;

      config.checkboxes
        .filter(checkbox => checkbox.queryParam)
        .forEach(checkbox => {
          if (self.state[checkbox.key]) {
            this.pathURI.setParam(checkbox.key, 1);
          } else {
            this.pathURI.delParam(checkbox.key);
          }
        });

      const result = config.format ? config.format(config, this.state, this.pathURI) : this.pathURI.toString();

      return (
        <div className={b()}>
          <div className={b('row', { header: true })}>{config.header}</div>
          <div className={b('row', { common: true })}>
            <span className={b('cell', { inline: true })}>
              <TextArea
                theme="normal"
                size="s"
                rows={3}
                controlAttrs={{ style: { resize: 'vertical' } }}
                text={result}
              />
            </span>
            <span className={b('cell', { flex: 'zero', inline: true })}>
              <ClipboardButton theme="pseudo" view="default" tone="default" size="s" text={result} />
            </span>
          </div>
          {config.shortLinkItem && this._tinyUrlButton(result)}
          {hasRadioBox() && this._radiobox()}
          {hasCheckboxes() && this._checkboxes()}
          <div className={b('row', { common: true, row: true })}>{config.text}</div>
        </div>
      );
    }
  };
}
