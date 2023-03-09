import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

// import './HoverRadioButton.scss';

const b = block('hover-radio-button');

function Radio({text, value, chosen, onMouseEnter, onMouseLeave, onClick}) {
    return (
        <div
            className={b('radio', {chosen})}
            onMouseEnter={() => onMouseEnter(value)}
            onMouseLeave={() => onMouseLeave(value)}
            onClick={() => onClick(value)}
        >
            {text}
        </div>
    );
}

class HoverRadioButton extends React.PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        value: PropTypes.string,
        values: PropTypes.arrayOf(PropTypes.string),
        radioText: PropTypes.arrayOf(PropTypes.string)
    };

    state = {value: this.props.value};

    onMouseEnter = value => {
        if (this.state.value !== value) {
            this.props.onChange(value);
        }
    };

    onMouseLeave = value => {
        if (this.state.value !== value) {
            this.props.onChange(this.state.value);
        }
    };

    onClick = value => {
        if (this.state.value !== value) {
            this.setState({value});
            this.props.onChange(value);
        }
    };

    render() {
        return (
            <div className={b()}>
                {this.props.values.map((value, i) => (
                    <Radio
                        key={value}
                        value={value}
                        text={this.props.radioText[i]}
                        chosen={value === this.state.value}
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                        onClick={this.onClick}
                    />
                ))}
            </div>
        );
    }
}

export default HoverRadioButton;
