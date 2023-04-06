import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { YCSelect } from '@kamatech-data-ui/common/src';

import { getAggregationLabel } from '../../constants';
import { FieldAggregation } from '../../../kamatech_modules/@kamatech-data-ui/clusterdata/src/constants/field-aggregation';

// import './AggregationSelect.scss';

const b = block('aggregation-select');

class AggregationSelect extends React.Component {
  static propTypes = {
    selectedAggregation: PropTypes.string.isRequired,
    types: PropTypes.array.isRequired,
    field: PropTypes.shape({
      aggregation_locked: PropTypes.bool,
      autoaggregated: PropTypes.bool,
    }),
    onSelect: PropTypes.func.isRequired,
    tabIndex: PropTypes.number,
    debounceTimeout: PropTypes.number,
  };

  _aggregationSelectRef = React.createRef();

  get aggregationList() {
    const {
      field: { cast: selectedCast },
      types,
    } = this.props;

    const { aggregations = [] } = types.find(type => type.name === selectedCast) || {};

    return aggregations.map((aggregation, index) => ({
      key: `aggregation-${index}`,
      value: aggregation,
      title: getAggregationLabel(aggregation),
    }));
  }

  onSelect = data => {
    const { onSelect } = this.props;

    // TODO: look for correct approach to close popup in dropdown by click on item in it
    if (this._aggregationSelectRef.current) {
      const { _onSwitcherClick } = this._aggregationSelectRef.current;

      if (_onSwitcherClick) {
        _onSwitcherClick();
      }
    }

    if (onSelect) {
      onSelect(data);
    }
  };

  getFieldType = () => {
    const { field: { autoaggregated } = {}, selectedAggregation } = this.props;
    let type;

    type = selectedAggregation === FieldAggregation.None ? 'dimension' : 'measure';

    if (autoaggregated) {
      type = 'measure';
    }

    return type;
  };

  render() {
    const {
      field,
      field: { autoaggregated, aggregation_locked: aggregationLocked } = {},
      selectedAggregation,
    } = this.props;

    const type = this.getFieldType();
    const aggregation = autoaggregated ? 'auto' : selectedAggregation;
    const additionalItems = [];

    if (autoaggregated) {
      additionalItems.push({
        value: 'auto',
        key: 'aggregation-auto',
        title: getAggregationLabel('auto'),
      });
    }

    const items = [...this.aggregationList, ...additionalItems];

    return (
      <div className={b({ [type]: true })}>
        <YCSelect
          ref={this._aggregationSelectRef}
          hiding
          disabled={aggregationLocked}
          controlWidth={144}
          showSearch={false}
          showArrow={false}
          value={aggregation}
          items={items}
          onChange={value =>
            this.onSelect({
              row: field,
              newSelectedValue: value,
            })
          }
        />
      </div>
    );
  }
}

export default AggregationSelect;
