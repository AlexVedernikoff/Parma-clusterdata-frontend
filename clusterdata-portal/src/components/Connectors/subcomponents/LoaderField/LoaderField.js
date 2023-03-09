import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import {Loader} from '@parma-data-ui/common/src';

// import './LoaderField.scss';


const b = block('dl-connector-loader-field');

class LoaderField extends React.Component {
    static propTypes = {
        visible: PropTypes.bool,
        size: PropTypes.oneOf(['s', 'm', 'l'])
    };

    static defaultProps = {
        visible: false,
        size: 's'
    };

    render() {
        const {visible, size} = this.props;

        return visible && (
            <div className={b()}>
                <Loader
                    className={b('animation')}
                    size={size}
                />
            </div>
        );
    }
}

export default LoaderField;
