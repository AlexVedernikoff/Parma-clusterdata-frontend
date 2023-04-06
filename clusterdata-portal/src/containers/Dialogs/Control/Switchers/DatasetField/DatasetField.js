import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import sortBy from 'lodash/sortBy';
import { YCSelect } from '@kamatech-data-ui/common/src';
import { DataTypeIconSelector } from '@kamatech-data-ui/clusterdata';
import withWrap from '../../withWrap/withWrap';
import { SDK } from '../../../../../modules/sdk';
import { i18n } from '@kamatech-data-ui/clusterdata';

const b = block('control-switcher-dataset-field');

class DatasetField extends React.PureComponent {
  static propTypes = {
    datasetId: PropTypes.string,
    fieldId: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    parentBlock: PropTypes.func.isRequired,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.datasetId === prevState.datasetId) {
      return null;
    }

    return {
      datasetId: nextProps.datasetId,
      items: null,
    };
  }

  state = {};

  componentDidMount() {
    if (this.props.datasetId) {
      this.getDatasetFields();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.datasetId && this.props.datasetId !== prevProps.datasetId) {
      this.getDatasetFields();
    }
  }

  getDatasetFields() {
    SDK.bi
      .getDataSetFieldsById({ dataSetId: this.props.datasetId })
      .then(({ fields }) => this.setState({ items: sortBy(fields, 'title') }))
      .catch(error => console.error('DATASET_FIELDS', error));
  }

  render() {
    const { fieldId, onChange } = this.props;
    const { items } = this.state;
    return (
      <YCSelect
        popupWidth={400}
        showSearch={true}
        showItemIcon={true}
        disabled={!items}
        placeholder={i18n('dash.control-dialog.edit', 'context_choose')}
        value={fieldId}
        onChange={fieldId => onChange({ fieldId, fieldName: items.find(({ guid }) => guid === fieldId).title })}
        items={(items || []).map(({ title, guid, data_type }) => ({
          value: guid,
          title,
          key: guid,
          icon: data_type ? <DataTypeIconSelector type={data_type} className={b('icon')} /> : null,
        }))}
      />
    );
  }
}

export default withWrap(DatasetField);
