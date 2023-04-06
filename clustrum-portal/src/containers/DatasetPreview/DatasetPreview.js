import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import PreviewTable from '../../components/PreviewTable/PreviewTable';
import PreviewHeader from '../../components/PreviewHeader/PreviewHeader';
import PreviewResizer from '../../components/PreviewResizer/PreviewResizer';
import {
  changeAmountPreviewRows,
  datasetPreviewSelector,
  previewEnabledSelector,
  togglePreview,
  toggleVisibilityPreview,
} from '../../store/reducers/dataset';
import { DATASET_TABS } from '../../constants';
import { i18n } from '../../../kamatech_modules/@kamatech-data-ui/clustrum';
import { ResizerType } from '../../constants/ResizerType';

// import './DatasetPreview.scss';

const b = block('dataset-preview');

class DatasetPreview extends React.Component {
  static defaultProps = {};

  static propTypes = {
    previewEnabled: PropTypes.bool.isRequired,
    datasetPreview: PropTypes.object.isRequired,
    togglePreview: PropTypes.func.isRequired,
    toggleVisibilityPreview: PropTypes.func.isRequired,
    changeAmountPreviewRows: PropTypes.func.isRequired,
    tab: PropTypes.oneOf(DATASET_TABS),
    datasetUpdated: PropTypes.bool.isRequired,
  };

  render() {
    const {
      previewEnabled,
      datasetPreview,
      datasetPreview: { isVisible, view, amountPreviewRows } = {},
      tab,
      togglePreview,
      toggleVisibilityPreview,
      changeAmountPreviewRows,
      datasetUpdated,
    } = this.props;

    if (!previewEnabled) {
      return null;
    }

    return (
      <PreviewResizer isVisible={isVisible} view={view} tab={tab} className={ResizerType.PREVIEW}>
        <div className={b()}>
          <PreviewHeader
            view={view}
            amountPreviewRows={amountPreviewRows}
            togglePreview={togglePreview}
            toggleVisibilityPreview={toggleVisibilityPreview}
            changeAmountPreviewRows={changeAmountPreviewRows}
            headerTitle={i18n('dataset.dataset-editor.modify', 'section_preview')}
            fieldDisplayRowsTitle={i18n('dataset.dataset-editor.modify', 'field_display-rows')}
            maxAmountRowsTitle={i18n('dataset.dataset-editor.modify', 'label_max-amount-rows')}
            datasetUpdated={datasetUpdated}
          />
          <PreviewTable preview={datasetPreview} />
        </div>
      </PreviewResizer>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  datasetPreview: datasetPreviewSelector,
  previewEnabled: previewEnabledSelector,
});
const mapDispatchToProps = {
  togglePreview,
  toggleVisibilityPreview,
  changeAmountPreviewRows,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(DatasetPreview);
