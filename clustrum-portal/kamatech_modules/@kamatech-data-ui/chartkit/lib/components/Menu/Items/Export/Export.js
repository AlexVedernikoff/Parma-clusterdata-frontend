import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { RadioButton, Select } from 'lego-on-react';
import Modal from '../Modal/Modal';
import Icon, { extend } from '../../../Icon/Icon';
import { getStorageState } from '../../../../modules/export/export';
import { i18nV2 as i18nFactory } from '../../../../modules/i18n/i18n';
import * as keyset from './i18n';
import { ExportFormat } from '../../../../modules/export/ExportFormat';
import { Encoding } from '../../../../modules/export/Encoding';

extend({
  download: <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />,
});

const i18n = i18nFactory(keyset);
const b = block('chartkit-export-modal');

function Block({ title, children }) {
  return (
    <div className={b('block')}>
      <div className={b('block-header')}>{title}</div>
      <div className={b('block-body')}>{children}</div>
    </div>
  );
}

Block.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired,
};

function Row({ title, children }) {
  return (
    <div className={b('row')}>
      <div className={b('row-header')}>{title}</div>
      <div className={b('row-body')}>{children}</div>
    </div>
  );
}

Row.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired,
};

class Export extends React.PureComponent {
  static propTypes = {
    element: PropTypes.object.isRequired,
    runPayload: PropTypes.object.isRequired,
    exportWidget: PropTypes.func,
  };

  state = Object.assign(
    {
      format: ExportFormat.XLSX,
      delValues: null,
      delNumbers: null,
      encoding: null,
    },
    getStorageState(),
  );

  onApply = () => {
    const { exportWidget, runPayload } = this.props;

    if (exportWidget) {
      exportWidget(runPayload, this.state);
    } else {
      console.error('Отсутствует метод exportWidget!');
    }
  };

  changeFormat(format) {
    if (format === ExportFormat.CSV) {
      this.setState({
        format,
        delValues: ';',
        delNumbers: '.',
        encoding: Encoding.UTF8,
      });
    } else {
      this.setState({
        format,
        delValues: null,
        delNumbers: null,
        encoding: null,
      });
    }
  }

  renderSettings() {
    if ([ExportFormat.XLSX, ExportFormat.XLS].includes(this.state.format)) {
      return null;
    }

    const commonProps = { theme: 'normal', view: 'default', tone: 'default', size: 'n', type: 'radio', width: 'max' };

    return (
      <Block title={i18n('settings')}>
        <Row title={i18n('valuesDelimiter')}>
          <Select {...commonProps} val={this.state.delValues} onChange={([delValues]) => this.setState({ delValues })}>
            <Select.Item val=";">{`${i18n('semicolon')} ;`}</Select.Item>
            <Select.Item val=",">{`${i18n('comma')} ,`}</Select.Item>
            <Select.Item val="tab">{i18n('tab')}</Select.Item>
            <Select.Item val="space">{i18n('space')}</Select.Item>
          </Select>
        </Row>
        <Row title={i18n('decimalDelimiter')}>
          <Select
            {...commonProps}
            val={this.state.delNumbers}
            onChange={([delNumbers]) => this.setState({ delNumbers })}
          >
            <Select.Item val=".">{`${i18n('dot')} .`}</Select.Item>
            <Select.Item val=",">{`${i18n('comma')} ,`}</Select.Item>
          </Select>
        </Row>
        <Row title={i18n('encoding')}>
          <Select {...commonProps} val={this.state.encoding} onChange={([encoding]) => this.setState({ encoding })}>
            <Select.Item val={Encoding.UTF8}>utf8</Select.Item>
            <Select.Item val={Encoding.CP1251}>cp1251</Select.Item>
          </Select>
        </Row>
      </Block>
    );
  }

  render() {
    return (
      <Modal element={this.props.element}>
        <Modal.Header caption={i18n('title')} />
        <Modal.Body className={b()}>
          <Block title={i18n('format')}>
            <RadioButton
              theme="normal"
              view="default"
              tone="default"
              size="m"
              value={this.state.format}
              onChange={event => this.changeFormat(event.target.value)}
            >
              <RadioButton.Radio value={ExportFormat.XLSX}>XLSX</RadioButton.Radio>
              <RadioButton.Radio value={ExportFormat.XLS}>XLS</RadioButton.Radio>
              <RadioButton.Radio value={ExportFormat.CSV}>CSV</RadioButton.Radio>
            </RadioButton>
          </Block>
          {this.renderSettings()}
          <div className={b('hint')}>{i18n('hint')}</div>
        </Modal.Body>
        <Modal.Footer onApply={this.onApply} applyText={i18n('download')} />
      </Modal>
    );
  }
}

export default {
  title: { toString: () => i18n('title') },
  icon: <Icon size="20" name="download" />,
  isVisible: ({ loadedData: { data } = {} }) => Boolean(data),
  action: ({ event, anchorNode, runPayload, options, exportWidget }) => {
    if (event.ctrlKey || event.metaKey) {
      if (exportWidget) {
        exportWidget(runPayload);
      } else {
        console.error('Отсутствует метод exportWidget!');
      }
    } else {
      ReactDOM.render(<Export element={anchorNode} runPayload={runPayload} exportWidget={exportWidget} />, anchorNode);
    }
  },
};
