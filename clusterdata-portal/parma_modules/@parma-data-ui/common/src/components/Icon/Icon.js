import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

// import './IconStyles.scss';

const b = block('yc-icon');

const propTypes = {
    data: PropTypes.shape({
        viewBox: PropTypes.string.isRequired,
        url: PropTypes.string,
        id: PropTypes.string
    }).isRequired,
    width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    fill: PropTypes.string,
    stroke: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func
};

export default function Icon({data, width, height, className, onClick, fill, stroke}) {
    let w = width;
    let h = height;
    if (data.viewBox && (!width || !height)) {
        // Parse width and height from viewBox if not specified
        const values = data.viewBox.split(/\s+|\s*,\s*/);

        if (!width) { w = values[2]; }
        if (!height) { h = values[3]; }
    }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox={data.viewBox}
            width={w}
            height={h}
            fill={fill}
            stroke={stroke}
            className={b(false, className)}
            onClick={onClick}
        >
            <use href={Icon.prefix + (data.url || `#${data.id}`)}/>
        </svg>
    );
}

Icon.displayName = 'Icon';
Icon.propTypes = propTypes;

Icon.defaultProps = {
    fill: 'currentColor',
    stroke: 'none'
};

Icon.prefix = '';
