import React from 'react';
import PropTypes from 'prop-types';

import {Button} from 'lego-on-react';

import CopyToClipboard from '@parma-data-ui/react-components/src/components/CopyToClipboard';
import Icon, {extend} from '../../../Icon/Icon';
import PopupMessage from '../PopupMessage/PopupMessage';

import i18nFactory from '../../../../modules/i18n/i18n';

extend({
    copy: <path d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1z" />
});

const i18n = i18nFactory('ClipboardButton');

export default class ClipboardButton extends React.PureComponent {
    static propTypes = {
        text: PropTypes.string.isRequired, // текст, который будет скопирован в буфер
        className: PropTypes.string
    };

    state = {
        showPopup: false,
        theme: 'normal',
        message: ''
    };

    onCopy = (text, isSuccess) => isSuccess ?
        this.setState({showPopup: true, theme: 'normal', message: i18n('copied')}) :
        this.setState({showPopup: true, theme: 'error', message: i18n('error')});

    onOutsideClick = () => this.setState({showPopup: false});

    render() {
        const {text, ..._props} = this.props;

        return (
            <div className={this.props.className}>
                <CopyToClipboard
                    text={text}
                    resetTimeout={5000}
                    onCopy={this.onCopy}
                >
                    {() => (
                        <Button
                            {..._props}
                            ref={(component) => { this._buttonComponent = component; }}
                        >
                            <Icon name="copy" size="20"/>
                        </Button>
                    )}
                </CopyToClipboard>
                <PopupMessage
                    autoclosable
                    key="message"
                    theme={this.state.theme}
                    size="s"
                    anchor={this._buttonComponent}
                    to="top"
                    toSide="center"
                    visible={this.state.showPopup}
                    onOutsideClick={this.onOutsideClick}
                >
                    {this.state.message}
                </PopupMessage>
            </div>
        );
    }
}
