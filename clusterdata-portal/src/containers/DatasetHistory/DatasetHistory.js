import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import HistoryTable from '../../components/HistoryTable/HistoryTable';
import PreviewHeader from '../../components/PreviewHeader/PreviewHeader';
import PreviewResizer from '../../components/PreviewResizer/PreviewResizer';
import {
  changeAmountHistoryRows,
  datasetHistorySelector,
  previewEnabledSelector,
  toggleHistory,
  toggleVisibilityHistory,
} from '../../store/reducers/dataset';
import { DATASET_TABS } from '../../constants';
import { i18n } from '../../../kamatech_modules/@kamatech-data-ui/clusterdata';
import { ResizerType } from '../../constants/ResizerType';

const b = block('dataset-history');

class DatasetHistory extends React.Component {
  static defaultProps = {};

  static propTypes = {
    previewEnabled: PropTypes.bool.isRequired,
    datasetHistory: PropTypes.object.isRequired,
    toggleHistory: PropTypes.func.isRequired,
    toggleVisibilityHistory: PropTypes.func.isRequired,
    changeAmountHistoryRows: PropTypes.func.isRequired,
    tab: PropTypes.oneOf(DATASET_TABS),
    datasetUpdated: PropTypes.bool.isRequired,
  };

  render() {
    const {
      previewEnabled,
      datasetHistory,
      datasetHistory: { isVisible, view, amountPreviewRows } = {},
      tab,
      toggleHistory,
      toggleVisibilityHistory,
      changeAmountHistoryRows,
      datasetUpdated,
    } = this.props;

    if (!previewEnabled) {
      return null;
    }

    return (
      <PreviewResizer isVisible={isVisible} view={view} tab={tab} className={ResizerType.HISTORY}>
        <div className={b()}>
          <PreviewHeader
            view={view}
            amountPreviewRows={amountPreviewRows}
            togglePreview={toggleHistory}
            toggleVisibilityPreview={toggleVisibilityHistory}
            changeAmountPreviewRows={changeAmountHistoryRows}
            headerTitle={i18n('dataset.dataset-editor.modify', 'section_history')}
            fieldDisplayRowsTitle={i18n('dataset.dataset-editor.modify', 'field_history-display-rows')}
            maxAmountRowsTitle={i18n('dataset.dataset-editor.modify', 'label_max-amount-history-rows')}
            datasetUpdated={datasetUpdated}
          />
          <HistoryTable history={datasetHistory} />
        </div>
      </PreviewResizer>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  datasetHistory: datasetHistorySelector,
  previewEnabled: previewEnabledSelector,
});

const mapDispatchToProps = {
  toggleHistory,
  toggleVisibilityHistory,
  changeAmountHistoryRows,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(DatasetHistory);
