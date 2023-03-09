import React, {Component} from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

// import './Loader.scss';

const b = block('du-loader');

const propTypes = {
    size: PropTypes.string,
    className: PropTypes.string
};

const defaultProps = {
    size: 's'
};

export default class Loader extends Component {
    render() {
        const {size, className} = this.props;

        return (
            <div className={b({size}, className)}/>
        );
    }
}

Loader.propTypes = propTypes;
Loader.defaultProps = defaultProps;
