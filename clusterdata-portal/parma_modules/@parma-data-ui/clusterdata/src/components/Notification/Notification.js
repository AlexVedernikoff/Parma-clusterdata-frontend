import React, {Component} from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import Icon from '@parma-data-ui/common/src/components/Icon/Icon';
import isEqual from 'lodash/isEqual';

// import './Notification.scss';
import iconOkay from 'icons/okay.svg';
import iconError from 'icons/error.svg';
import iconUndefined from 'icons/undefined.svg';
import iconSearchClear from 'icons/search-clear.svg';

const b = block('notification');
const CONST = {
    SUCCESS: 'success',
    ERROR: 'error'
};

const typeSwitcher = ({type}) => {
    const size = '18';
    switch (type) {
        case CONST.SUCCESS:
            return {
                className: b({type: CONST.SUCCESS}),
                icon: (<Icon className={b('icon')} data={iconOkay} width={size} height={size}/>)
            };
        case CONST.ERROR:
            return {
                className: b({type: CONST.ERROR}),
                icon: (<Icon className={b('icon')} data={iconError} width={size} height={size}/>)
            };
        default:
            return {
                className: b({type: 'default'}),
                icon: (<Icon className={b('icon')} data={iconUndefined} width={size} height={size}/>)
            };
    }
};

export default class Notification extends Component {
    static defaultProps = {
        notify: null,
        timeout: 5000
    }

    static propTypes = {
        notify: PropTypes.object,
        timeout: PropTypes.number
    };

    constructor(props) {
        super(props);
        this.timeoutID = null;
    }

    state = {
        currentNotify: null
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.notify !== null &&
            !isEqual(this.state.currentNotify, nextProps.notify)
        ) {
            this.setState({
                currentNotify: nextProps.notify
            });
            this.updateTimeout();
        }
    }

    componentWillUnmount() {
        this.clearTimeout();
    }

    updateTimeout() {
        this.clearTimeout();
        setTimeout(() => {
            this.setState({
                currentNotify: null
            });
        }, this.props.timeout);
    }

    onClose = () => {
        this.clearTimeout();
        this.setState({
            currentNotify: null
        });
    }

    clearTimeout() {
        clearTimeout(this.thimeoutID);
    }

    displayNotification() {
        const {currentNotify} = this.state;
        if (currentNotify === null) {
            return null;
        }
        const typeInfo = typeSwitcher(currentNotify);
        const className = `${b()} ${typeInfo.className}`;
        return (
            <div className={className}>
                {typeInfo.icon}
                <div className={b('message')}>{currentNotify.message}</div>
                <div className={b('close')} onClick={this.onClose}>
                    <Icon className={b('icon-close')} data={iconSearchClear} width="14" height="14"/>
                </div>
            </div>
        );
    }

    render() {
        const {currentNotify} = this.state;
        return (
            <span>
                { currentNotify ? this.displayNotification() : null }
            </span>
        );
    }
}
