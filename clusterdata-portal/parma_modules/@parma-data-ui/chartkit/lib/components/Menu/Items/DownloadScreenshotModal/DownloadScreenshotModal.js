import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Button, CheckBox, RadioBox, TextInput, Link } from 'lego-on-react';
import i18nFactory from '../../../../modules/i18n/i18n';

import ChartsModal from '../ChartsModal/ChartsModal';
import DownloadScreenshotJing from '../DownloadScreenshotJing/DownloadScreenshotJing';
import { SIZES, PARAMETERS, LOCAL_STORAGE_KEY } from '../DownloadScreenshot/constants';

// import './DownloadScreenshotModal.scss';

// TODO: ссылка на вики Charts
const API_WIKI = '';

const i18n = i18nFactory('DownloadScreenshotModal');
const b = block('download-screenshot-modal');

// TODO: нет попапа на ошибку "Сохранить в Jing"
export default class DownloadScreenshotModal extends React.PureComponent {
  static propTypes = {
    element: PropTypes.object.isRequired, // DOM-элемент, на который был mountComponent,
    download: PropTypes.func.isRequired,
    getScreenshotUrl: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const storageState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

    if (storageState) {
      this.state = storageState;
    } else {
      const state = {
        sizeIndex: 0,
        width: '',
        height: '',
      };

      PARAMETERS.forEach(parameter => {
        state[parameter.name] = Boolean(parameter.val);
      });

      this.state = state;
    }
  }

  _download = proxy => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.state));
    this.props.download(this.state);
    this._onClickClose(proxy);
  };

  _sizeTitle = size => `${i18n(size.key)} (${size.width}x${size.height})`;

  _textInput = name => (
    <TextInput
      mix={{ block: 'radio-inputs', elem: 'input' }}
      disabled={this.state.sizeIndex !== SIZES.length}
      theme="normal"
      view="default"
      tone="default"
      size="s"
      text={this.state[name]}
      onChange={value => this._onChangeTextInput(value, name)}
    />
  );

  // TODO: type="number" для TextInput / ISL-4095
  _onChangeTextInput = (value, name) => {
    if (!/\D/.test(value)) {
      this.setState({ [name]: value });
    }
  };

  _onClickClose = proxy => ChartsModal.onClickClose(proxy, this.props.element);

  render() {
    return (
      <ChartsModal element={this.props.element}>
        <ChartsModal.Section>
          <ChartsModal.Header>{i18n('header-save-image')}</ChartsModal.Header>
          <ChartsModal.Body>
            <div className={b()}>
              <div className={b('row', { column: true })}>
                <div className={b('cell', { column: true })}>
                  <RadioBox
                    mix={{ block: b('cell-radiobox') }}
                    theme="normal"
                    view="default"
                    tone="default"
                    size="s"
                    value={this.state.sizeIndex}
                    name="radiobox"
                    onChange={proxy => this.setState({ sizeIndex: Number(proxy.target.value) })}
                  >
                    {SIZES.map((size, index) => (
                      <RadioBox.Radio value={index} key={size.key}>
                        {this._sizeTitle(size)}
                      </RadioBox.Radio>
                    ))}
                    <RadioBox.Radio value={SIZES.length} key={'size-another'}>
                      {i18n('size-another')}
                    </RadioBox.Radio>
                  </RadioBox>
                  <div className={b('cell')}>
                    <span className="radio-inputs">
                      {this._textInput('width')}x{this._textInput('height')}
                    </span>
                  </div>
                </div>
              </div>
              <div className={b('row', { column: true })}>
                <div className={b('cell', { header: true })}>{i18n('parameters')}</div>
                {PARAMETERS.map(parameter => (
                  <div className={b('cell')} key={parameter.key}>
                    <CheckBox
                      theme="normal"
                      view="default"
                      tone="default"
                      size="s"
                      checked={this.state[parameter.name]}
                      onChange={() => this.setState({ [parameter.name]: !this.state[parameter.name] })}
                    >
                      {i18n(parameter.key)}
                    </CheckBox>
                  </div>
                ))}
              </div>
              <div className={b('row', { hint: true })}>
                {i18n('hint-screenshot', {
                  link: (
                    <Link key="wiki-link" theme="normal" url={API_WIKI} target="_blank">
                      API
                    </Link>
                  ),
                })}
              </div>
            </div>
          </ChartsModal.Body>
          <div className={b('footer')}>
            <div className={b('button', { jing: true })}>
              <DownloadScreenshotJing
                text={i18n('button-to-jing')}
                screenshotUrl={this.props.getScreenshotUrl(this.state)}
              />
            </div>
            <Button
              theme="action"
              view="default"
              tone="default"
              size="m"
              mix={{ block: b('button') }}
              onClick={this._download}
            >
              {i18n('button-download')}
            </Button>
            <Button
              theme="pseudo"
              view="default"
              tone="default"
              size="m"
              mix={{ block: b('button') }}
              onClick={this._onClickClose}
            >
              {i18n('button-cancel')}
            </Button>
          </div>
        </ChartsModal.Section>
      </ChartsModal>
    );
  }
}
