import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { RadioButton, Select } from 'lego-on-react';
import Modal from '../Modal/Modal';
import Icon, { extend } from '../../../Icon/Icon';
import { getStorageState } from '../../../../modules/export/export';
import { ExportFormat } from '../../../../modules/export/ExportFormat';
import { Encoding } from '../../../../modules/export/Encoding';

extend({
  download: <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />,
});

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
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
    .isRequired,
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
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
    .isRequired,
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
    if (
      [
        ExportFormat.XLSX,
        ExportFormat.XLS,
        ExportFormat.XLSX_FROM_TEMPLATE,
        ExportFormat.DOCX_FROM_TEMPLATE,
      ].includes(this.state.format)
    ) {
      return null;
    }

    const commonProps = {
      theme: 'normal',
      view: 'default',
      tone: 'default',
      size: 'n',
      type: 'radio',
      width: 'max',
    };

    return (
      <Block title="Настройки">
        <Row title="Разделитель значений">
          <Select
            {...commonProps}
            val={this.state.delValues}
            onChange={([delValues]) => this.setState({ delValues })}
          >
            <Select.Item val=";">точка с запятой ;</Select.Item>
            <Select.Item val=",">запятая ,</Select.Item>
            <Select.Item val="tab">таб</Select.Item>
            <Select.Item val="space">пробел</Select.Item>
          </Select>
        </Row>
        <Row title="Разделитель дробной части">
          <Select
            {...commonProps}
            val={this.state.delNumbers}
            onChange={([delNumbers]) => this.setState({ delNumbers })}
          >
            <Select.Item val=".">точка .</Select.Item>
            <Select.Item val=",">запятая ,</Select.Item>
          </Select>
        </Row>
        <Row title="Кодировка">
          <Select
            {...commonProps}
            val={this.state.encoding}
            onChange={([encoding]) => this.setState({ encoding })}
          >
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
        <Modal.Header caption="Экспорт данных" />
        <Modal.Body className={b()}>
          <Block title="Формат">
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
              <RadioButton.Radio value={ExportFormat.XLSX_FROM_TEMPLATE}>
                XLSX (из шаблона)
              </RadioButton.Radio>
              <RadioButton.Radio value={ExportFormat.DOCX_FROM_TEMPLATE}>
                DOCX (из шаблона)
              </RadioButton.Radio>
            </RadioButton>
          </Block>
          {this.renderSettings()}
          <div className={b('hint')}>
            Этот диалог можно пропустить, кликнув по элементу меню с зажатым CMD/CTRL
          </div>
        </Modal.Body>
        <Modal.Footer onApply={this.onApply} applyText="Скачать" />
      </Modal>
    );
  }
}

export default {
  title: 'Экспорт данных',
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
      ReactDOM.render(
        <Export
          element={anchorNode}
          runPayload={runPayload}
          exportWidget={exportWidget}
        />,
        anchorNode,
      );
    }
  },
};
