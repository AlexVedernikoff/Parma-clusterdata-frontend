import React from 'react';
import PropTypes from 'prop-types';
import { YCSelect } from '@kamatech-data-ui/common/src';
import { ControlSourceType } from '@lib-shared/types';
import CheckBox from '../Switchers/CheckBox';
import Acceptable from './Acceptable/Acceptable';
import Wrapper from '../Wrapper/Wrapper';
import { SDK } from '../../../../modules/sdk';
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
      nextProps.sourceType === ControlSourceType.Manual ||
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
    if (
      datasetId &&
      datasetField &&
      (datasetId !== prevProps.datasetId || datasetField !== prevProps.datasetField)
    ) {
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

  handleAvailableValuesChange(
    defaultValue,
    selectedAvailableValues,
    availableValuesList,
  ) {
    const availableValues =
      selectedAvailableValues.length > 0 ? selectedAvailableValues : availableValuesList;

    return {
      availableValues: selectedAvailableValues,
      defaultValue: this.filterByAvailableValues(defaultValue, availableValues),
    };
  }

  render() {
    const {
      sourceType,
      defaultValue,
      availableValues,
      multiselectable,
      onChange,
    } = this.props;
    const { acceptableValues = [] } = this.state;

    const selectedAvailableValues = Array.isArray(availableValues)
      ? this.filterByAvailableValues(acceptableValues, availableValues)
      : [];
    const availableValuesList =
      selectedAvailableValues.length > 0 ? selectedAvailableValues : acceptableValues;
    let selectedDefaultValues = [];

    if (Array.isArray(defaultValue)) {
      selectedDefaultValues = defaultValue;
    }

    if (typeof defaultValue === 'string') {
      selectedDefaultValues = [defaultValue];
    }

    const availableSelectedDefaultValues = this.filterByAvailableValues(
      selectedDefaultValues,
      availableValuesList,
    );

    return (
      <React.Fragment>
        {sourceType === ControlSourceType.Manual && (
          <Acceptable
            acceptableValues={acceptableValues}
            multiselectable={multiselectable}
            onApply={onChange}
          />
        )}
        <CheckBox
          text="Множественный выбор"
          checked={multiselectable}
          onChange={() =>
            onChange({ multiselectable: !multiselectable, defaultValue: undefined })
          }
        />
        <Wrapper title="Значение по умолчанию">
          <YCSelect
            showSearch={true}
            type={multiselectable ? 'multiple' : 'single'}
            allowEmptyValue={true}
            value={availableSelectedDefaultValues}
            onChange={defaultValue => onChange({ defaultValue })}
            disabled={!availableValuesList.length}
            placeholder="Не определено"
            items={availableValuesList.map(value => ({
              value,
              title: value,
              key: value,
            }))}
          />
        </Wrapper>
        <Wrapper title="Доступные значения">
          <YCSelect
            showSearch={true}
            type={'multiple'}
            allowEmptyValue={true}
            value={selectedAvailableValues}
            onChange={selectedAvailableValues =>
              onChange(
                this.handleAvailableValuesChange(
                  selectedDefaultValues,
                  selectedAvailableValues,
                  availableValuesList,
                ),
              )
            }
            disabled={!acceptableValues.length}
            placeholder="Не определено"
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
