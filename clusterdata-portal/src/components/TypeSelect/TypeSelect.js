import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import {DataTypeIconSelector} from '@parma-data-ui/clusterdata';
import {YCSelect} from '@parma-data-ui/common/src';

import {getFieldTypeLabel} from '../../constants';

// import './TypeSelect.scss';


const b = block('type-select');


class TypeSelect extends React.Component {
    static defaultProps = {};

    static propTypes = {
        selectedType: PropTypes.string.isRequired,
        types: PropTypes.array.isRequired,
        field: PropTypes.object.isRequired,
        onSelect: PropTypes.func.isRequired,
        tabIndex: PropTypes.number,
        debounceTimeout: PropTypes.number
    };

    _typeSelectRef = React.createRef();

    get typeList() {
        const {
            types
        } = this.props;

        return types.map(({name}, index) => ({
            key: `type-${index}`,
            value: name,
            title: getFieldTypeLabel(name),
            icon: (
                <DataTypeIconSelector
                    className={b('type')}
                    type={name}
                />
            )
        }));
    }

    onSelect = (data) => {
        const {onSelect} = this.props;

        // TODO: look for correct approach to close popup in dropdown by click on item in it
        if (this._typeSelectRef.current) {
            const {
                _onSwitcherClick
            } = this._typeSelectRef.current;

            if (_onSwitcherClick) {
                _onSwitcherClick();
            }
        }

        if (onSelect) {
            onSelect(data);
        }
    };

    render() {
        const {
            field,
            selectedType
        } = this.props;

        return (
            <YCSelect
                ref={this._aggregationSelectRef}
                hiding
                controlWidth={175}
                showSearch={false}
                showArrow={false}
                showItemIcon={true}
                value={selectedType}
                items={this.typeList}
                onChange={(value) => this.onSelect({
                    row: field,
                    newSelectedValue: value
                })}
            />
        );
    }
}

export default TypeSelect;
