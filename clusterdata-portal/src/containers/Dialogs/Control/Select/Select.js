import React from 'react';
import PropTypes from 'prop-types';
import { YCSelect } from '@parma-data-ui/common/src';
import CheckBox from '../Switchers/CheckBox';
import Acceptable from './Acceptable/Acceptable';
import Wrapper from '../Wrapper/Wrapper';
import { SDK } from '../../../../modules/sdk';
import { i18n } from '@parma-data-ui/clusterdata';
import { CONTROL_SOURCE_TYPE } from '../../../../constants/constants';

class Select extends React.PureComponent {
  static propTypes = {
    sourceType: PropTypes.oneOf(Object.values(CONTROL_SOURCE_TYPE)).isRequired,
    datasetId: PropTypes.string,
    datasetField: PropTypes.string,
    acceptableValues: PropTypes.array,
    defaultValue: PropTypes.any,
    availableValues: PropTypes.any,
    multiselectable: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.sourceType === CONTROL_SOURCE_TYPE.MANUAL ||
      prevState.datasetId !== nextProps.datasetId ||
      prevState.datasetField !== nextProps.datasetField
    ) {
      return {
        datasetId: nextProps.datasetId,
        datasetField: nextProps.datasetField,
        acceptableValues: nextProps.acceptableValues,
      };
    }
    return null;
  }

  state = {};

  async componentDidMount() {
    const { datasetId, datasetField } = this.props;
    if (datasetId && datasetField && this.state.acceptableValues === undefined) {
      try {
        const {
          result: {
            data: { Data },
          },
        } = await SDK.bi.getResultBySQL({
          dataSetId: datasetId,
          version: 'draft',
          // limit: 1000,
          orderBy: [{ column: datasetField, direction: 'ASC' }],
          columns: [datasetField],
        });
        this.setState({ acceptableValues: Data.map(([value]) => value) });
      } catch (error) {
        console.error('SELECT_DATASET_FIELDS', error);
      }
    }
  }

  async componentDidUpdate(prevProps) {
    const { datasetId, datasetField } = this.props;
    if (datasetId && datasetField && (datasetId !== prevProps.datasetId || datasetField !== prevProps.datasetField)) {
      try {
        const {
          result: {
            data: { Data },
          },
        } = await SDK.bi.getResultBySQL({
          dataSetId: datasetId,
          version: 'draft',
          // limit: 1000,
          orderBy: [{ column: datasetField, direction: 'ASC' }],
          columns: [datasetField],
        });
        this.setState({ acceptableValues: Data.map(([value]) => value) });
      } catch (error) {
        console.error('SELECT_DATASET_FIELDS', error);
      }
    }
  }

  filterByAvailableValues(values, availableValues) {
    if (!values || !availableValues) {
      return [];
    }

    const availableSet = new Set(availableValues);

    return values.filter(value => availableSet.has(value));
  }

  handleAvailableValuesChange(defaultValue, selectedAvailableValues, availableValuesList) {
    const availableValues = selectedAvailableValues.length > 0 ? selectedAvailableValues : availableValuesList;

    return {
      availableValues: selectedAvailableValues,
      defaultValue: this.filterByAvailableValues(defaultValue, availableValues),
    };
  }

  render() {
    const { sourceType, defaultValue, availableValues, multiselectable, onChange } = this.props;
    const { acceptableValues = [] } = this.state;

    const selectedAvailableValues = Array.isArray(availableValues)
      ? this.filterByAvailableValues(acceptableValues, availableValues)
      : [];
    const availableValuesList = selectedAvailableValues.length > 0 ? selectedAvailableValues : acceptableValues;
    let selectedDefaultValues = [];

    if (Array.isArray(defaultValue)) {
      selectedDefaultValues = defaultValue;
    }

    if (typeof defaultValue === 'string') {
      selectedDefaultValues = [defaultValue];
    }

    const availableSelectedDefaultValues = this.filterByAvailableValues(selectedDefaultValues, availableValuesList);

    return (
      <React.Fragment>
        {sourceType === CONTROL_SOURCE_TYPE.MANUAL && (
          <Acceptable acceptableValues={acceptableValues} multiselectable={multiselectable} onApply={onChange} />
        )}
        <CheckBox
          text={i18n('dash.control-dialog.edit', 'field_multiselectable')}
          checked={multiselectable}
          onChange={() => onChange({ multiselectable: !multiselectable, defaultValue: undefined })}
        />
        <Wrapper title={i18n('dash.control-dialog.edit', 'field_default-value')}>
          <YCSelect
            showSearch={true}
            type={multiselectable ? 'multiple' : 'single'}
            allowEmptyValue={true}
            value={availableSelectedDefaultValues}
            onChange={defaultValue => onChange({ defaultValue })}
            disabled={!availableValuesList.length}
            placeholder={i18n('dash.control-dialog.edit', 'value_undefined')}
            items={availableValuesList.map(value => ({
              value,
              title: value,
              key: value,
            }))}
          />
        </Wrapper>
        <Wrapper title={i18n('dash.control-dialog.edit', 'field_available-values')}>
          <YCSelect
            showSearch={true}
            type={'multiple'}
            allowEmptyValue={true}
            value={selectedAvailableValues}
            onChange={selectedAvailableValues =>
              onChange(
                this.handleAvailableValuesChange(selectedDefaultValues, selectedAvailableValues, availableValuesList),
              )
            }
            disabled={!acceptableValues.length}
            placeholder={i18n('dash.control-dialog.edit', 'value_undefined')}
            items={acceptableValues.map(value => ({
              value,
              title: value,
              key: value,
            }))}
          />
        </Wrapper>
      </React.Fragment>
    );
  }
}

export default Select;
