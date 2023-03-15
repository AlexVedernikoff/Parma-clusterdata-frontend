import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Icon } from '@parma-data-ui/common/src';
import { TextInput, Button } from 'lego-on-react';
import _debounce from 'lodash/debounce';
import { i18n } from '@parma-data-ui/clusterdata';

// import './PreviewHeader.scss';

import iconPreviewClose from '@parma-data-ui/clusterdata/src/icons/preview-close.svg';
import iconPreviewBottom from '@parma-data-ui/clusterdata/src/icons/preview-bottom.svg';
import iconPreviewExpand from '@parma-data-ui/clusterdata/src/icons/preview-expand.svg';
import iconPreviewSide from '@parma-data-ui/clusterdata/src/icons/preview-side.svg';
import { changeAmountPreviewRows } from '../../store/reducers/dataset';

const b = block('preview-header');

class PreviewHeader extends React.Component {
  static defaultProps = {};

  static propTypes = {
    amountPreviewRows: PropTypes.number.isRequired,
    view: PropTypes.string.isRequired,
    togglePreview: PropTypes.func.isRequired,
    toggleVisibilityPreview: PropTypes.func.isRequired,
    changeAmountPreviewRows: PropTypes.func.isRequired,
    headerTitle: PropTypes.string.isRequired,
    fieldDisplayRowsTitle: PropTypes.string.isRequired,
    maxAmountRowsTitle: PropTypes.string.isRequired,
    datasetUpdated: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      amountPreviewRows: this.props.amountPreviewRows,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { amountPreviewRowsProps } = props;
    const { amountPreviewRowsState } = state;

    if (amountPreviewRowsProps !== amountPreviewRowsState) {
      return {
        amountPreviewRows: amountPreviewRowsProps,
      };
    }

    if (props.datasetUpdated === true && state.datasetUpdated === false) {
      const debouncedChangeAmountPreviewRows = _debounce(props.changeAmountPreviewRows, amountPreviewRowsProps);
      debouncedChangeAmountPreviewRows({
        amountPreviewRows: state.amountPreviewRows,
      });
    }

    if (props.datasetUpdated !== state.datasetUpdated) {
      return {
        datasetUpdated: props.datasetUpdated,
      };
    }

    return null;
  }

  changeAmountPreviewRows = amountPreviewRows => {
    const amountPreviewRowsNumber = Number(amountPreviewRows);

    if (amountPreviewRowsNumber === 0) {
      return this.setState({
        amountPreviewRows,
      });
    }

    if (
      ![undefined, null].includes(amountPreviewRows) &&
      amountPreviewRowsNumber >= 1 &&
      amountPreviewRowsNumber <= 10000
    ) {
      return this.setState(
        {
          amountPreviewRows,
        },
        () => {
          this.debouncedChangeAmountPreviewRows({
            amountPreviewRows: amountPreviewRowsNumber,
          });
        },
      );
    }
  };

  debouncedChangeAmountPreviewRows = _debounce(this.props.changeAmountPreviewRows, 1000);

  togglePreviewFull = () => {
    const { togglePreview } = this.props;

    togglePreview({ view: 'full' });
  };

  togglePreviewBottom = () => {
    const { togglePreview } = this.props;

    togglePreview({ view: 'bottom' });
  };

  togglePreviewRigth = () => {
    const { togglePreview } = this.props;

    togglePreview({ view: 'right' });
  };

  closePreview = () => {
    const { toggleVisibilityPreview } = this.props;

    toggleVisibilityPreview({ isVisible: false });
  };

  render() {
    const { view, headerTitle, fieldDisplayRowsTitle, maxAmountRowsTitle } = this.props;

    return (
      <div className={b()}>
        <span className={b('label', { bold: true })}>{headerTitle}</span>
        <div className={b('amount-preview-rows')}>
          <span>{fieldDisplayRowsTitle}</span>
          <TextInput
            cls={b('amount-preview-rows-inp')}
            theme="normal"
            type="number"
            size="s"
            view="default"
            tone="default"
            text={String(this.state.amountPreviewRows)}
            onChange={this.changeAmountPreviewRows}
            placeholder={i18n('dataset.dataset-editor.modify', 'button_enter-amount-rows')}
          />
          <span className={b('fade-text')}>{maxAmountRowsTitle}</span>
        </div>
        <div className={b('resize-panel')}>
          {view !== 'full' && (
            <Button
              cls={b('preview-switcher-btn')}
              theme="flat"
              size="s"
              view="default"
              tone="default"
              title={i18n('dataset.dataset-editor.modify', 'button_preview-full')}
              onClick={this.togglePreviewFull}
            >
              <Icon data={iconPreviewExpand} width="24" height="28" />
            </Button>
          )}
          {view !== 'right' && (
            <Button
              cls={b('preview-switcher-btn')}
              theme="flat"
              size="s"
              view="default"
              tone="default"
              title={i18n('dataset.dataset-editor.modify', 'button_preview-right')}
              onClick={this.togglePreviewRigth}
            >
              <Icon data={iconPreviewSide} width="24" height="28" />
            </Button>
          )}
          {view !== 'bottom' && (
            <Button
              cls={b('preview-switcher-btn')}
              theme="flat"
              size="s"
              view="default"
              tone="default"
              title={i18n('dataset.dataset-editor.modify', 'button_preview-bottom')}
              onClick={this.togglePreviewBottom}
            >
              <Icon data={iconPreviewBottom} width="24" height="28" />
            </Button>
          )}
          <Button
            cls={b('preview-switcher-btn')}
            theme="flat"
            size="s"
            view="default"
            tone="default"
            title={i18n('dataset.dataset-editor.modify', 'button_preview-close')}
            onClick={this.closePreview}
          >
            <Icon data={iconPreviewClose} width="24" height="28" />
          </Button>
        </div>
      </div>
    );
  }
}

export default PreviewHeader;
