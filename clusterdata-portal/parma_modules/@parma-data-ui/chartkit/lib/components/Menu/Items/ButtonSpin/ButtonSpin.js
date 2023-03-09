import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import {Button, Spin} from 'lego-on-react';

// import './ButtonSpin.scss';

const STATUSES = {
    INITIAL: 'initial',
    LOADING: 'loading'
};

const b = block('button-spin-react');

// TODO: перейти на _progress_yes / ISL-4026

export default class ButtonSpin extends React.PureComponent {
    static propTypes = {
        text: PropTypes.string,
        onClick: PropTypes.func.isRequired // callback на клик, который должен возвращать Promise/thenable
    };

    state = {status: STATUSES.INITIAL};

    componentWillReceiveProps() {
        this.setState({status: STATUSES.INITIAL});
    }

    render() {
        const isLoading = this.state.status === STATUSES.LOADING;
        const {text, onClick, ..._props} = this.props;

        return (
            <Button
                {..._props}
                disabled={isLoading}
                onClick={this._onClick}
            >
                <span className={b('text', {hidden: isLoading})}>
                    {text}
                </span>
                {isLoading && <Spin progress size="xs" mix={{block: b('spin')}}/>}
            </Button>
        );
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    _onClick = () => {
        this.setState({status: STATUSES.LOADING});
        const handler = () => this._isMounted && this.setState({status: STATUSES.INITIAL});
        this.props.onClick().then(handler, handler);
    };
}
