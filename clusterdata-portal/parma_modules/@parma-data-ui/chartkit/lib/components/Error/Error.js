import React from 'react';
import PropTypes from 'prop-types';

import Simple from './Simple/Simple';
import Sources from './Sources/Sources';
import {ERROR_TYPE} from '../../modules/error-dispatcher/error-dispatcher';

// import './Error.scss';

// не stateless, потому что, например, при ресайзе дашборда будет рендериться еще раз и выводить все ошибки
class Error extends React.PureComponent {
    static propTypes = {
        isEditMode: PropTypes.bool.isRequired,
        data: PropTypes.object.isRequired,
        requestId: PropTypes.string.isRequired,
        retryClick: PropTypes.func.isRequired
    };

    render() {
        // console.log('Error', 'render', this.props);

        if (this.props.data.error.type === ERROR_TYPE.DATA_FETCHING_ERROR
            || this.props.data.error.type === ERROR_TYPE.WIZARD_DATA_FETCHING_ERROR
        ) {
            return <Sources {...this.props}/>;
        }

        return <Simple {...this.props}/>;
    }
}

export default Error;
