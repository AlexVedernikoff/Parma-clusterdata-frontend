import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Icon } from '@kamatech-data-ui/common/src';
import { TextInput, Button } from 'lego-on-react';
import _debounce from 'lodash/debounce';

// import './PreviewHeader.scss';

import iconPreviewClose from '@kamatech-data-ui/clustrum/src/icons/preview-close.svg';
import iconPreviewBottom from '@kamatech-data-ui/clustrum/src/icons/preview-bottom.svg';
import iconPreviewExpand from '@kamatech-data-ui/clustrum/src/icons/preview-expand.svg';
import iconPreviewSide from '@kamatech-data-ui/clustrum/src/icons/preview-side.svg';
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
            placeholder=""
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
              title="На весь экран"
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
              title="Развернуть справа"
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
              title="Развернуть сниз"
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
            title="Закрыть"
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
