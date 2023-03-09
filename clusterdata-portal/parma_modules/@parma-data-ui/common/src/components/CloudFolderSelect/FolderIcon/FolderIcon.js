import React, {Component} from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

const b = block('yc-folder-icon');

// import './FolderIcon.scss';

const DEFAULT_COLOR = '#ff0000';
const DEFAULT_COEFFICIENT = 294336;
const MIN_CHAR_CODE = 64;

function generateColorByText(input) {
    if (typeof input !== 'string') {
        return DEFAULT_COLOR;
    }

    const COEFFICIENT = Math.floor(DEFAULT_COEFFICIENT / input.length);
    const color = input
        .split('')
        .reduce((result, current) => {
            return result + COEFFICIENT * (current.charCodeAt() - MIN_CHAR_CODE);
        }, 0)
        .toString(16);

    if (color.length !== 6) {
        return DEFAULT_COLOR;
    }

    return `#${color}`;
}

const WHITE_COLOR = '#ffffff';
const BLACK_COLOR = '#000000';

function getInvertColor(hexColor) {
    let hex = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;

    // Convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = Array.from(new Array(6), (item, index) => hex[Math.floor(index / 2)]).join('');
    }

    if (hex.length !== 6) {
        throw new Error(`Invalid HEX color: ${hex}`);
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);


    // http://stackoverflow.com/a/3943023/112731
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
        ? BLACK_COLOR
        : WHITE_COLOR;
}

export default class FolderIcon extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired
    };

    getStyle = (initials) => {
        const backgroundColor = generateColorByText(initials);
        const color = getInvertColor(backgroundColor);

        return {backgroundColor, color};
    };

    render() {
        const {title} = this.props;
        const initials = title.slice(0, 2);
        const style = this.getStyle(initials);

        return (
            <div className={b()} style={style}>
                {initials}
            </div>
        );
    }
}
