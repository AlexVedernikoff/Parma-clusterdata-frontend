import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import {FieldWrapper, YCSelect} from '@parma-data-ui/common/src';

// import './SelectField.scss';


const b = block('dl-connector-select-field');

class SelectField extends React.Component {
    static propTypes = {
        valueType: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        items: PropTypes.array,
        value: PropTypes.string,
        error: PropTypes.string,
        disabled: PropTypes.bool,
        widthSize: PropTypes.oneOf(['s', 'm', 'l'])
    };

    _onChange = value => {
        const {valueType, onChange} = this.props;
        onChange({[valueType]: value});
    };

    render() {
        const {
            items,
            value,
            error,
            disabled,
            widthSize
        } = this.props;

        return (
            <div className={b({[`width-${widthSize}`]: true})}>
                <FieldWrapper error={error}>
                    <YCSelect
                        cls={b('control')}
                        items={items}
                        value={value}
                        onChange={this._onChange}
                        showSearch={false}
                        disabled={disabled}
                    />
                </FieldWrapper>
            </div>
        );
    }
}

export default SelectField;
