import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import {Button} from 'lego-on-react';

import {Context} from '../Context/Context';

// import './Footer.scss';

const b = block('chartkit-modal-footer');

class Footer extends React.PureComponent {
    static contextType = Context;

    static propTypes = {
        applyText: PropTypes.string,
        onApply: PropTypes.func.isRequired
    };

    static defaultProps = {
        applyText: 'Применить'
    };

    onApply = () => {
        this.props.onApply();
        this.context.onClose();
    };

    render() {
        return (
            <div className={b()}>
                <Button
                    theme="pseudo"
                    view="default"
                    tone="default"
                    width="max"
                    size="m"
                    onClick={this.context.onClose}
                >
                    Отменить
                </Button>
                <Button
                    theme="action"
                    view="default"
                    tone="default"
                    width="max"
                    size="m"
                    onClick={this.onApply}
                >
                    {this.props.applyText}
                </Button>
            </div>
        );
    }
}

export default Footer;
