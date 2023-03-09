import React from 'react';
import PropTypes from 'prop-types';

function SvgLine(props) {
    return (
        <svg
            version="1.1"
            width={props.width}
            height="5"
        >
            <path
                fill="none"
                d={`M 0 0 L ${props.width} 0`}
                stroke="black"
                strokeWidth={props.strokeWidth}
                strokeDasharray={props.strokeDashArray}
            />
        </svg>
    );
}

SvgLine.defaultProps = {
    width: '100',
    strokeDashArray: 'none',
    strokeWidth: '4'
};
SvgLine.propsType = {
    width: PropTypes.string.isRequired,
    strokeDashArray: PropTypes.string,
    strokeWidth: PropTypes.string
};

export default SvgLine;
