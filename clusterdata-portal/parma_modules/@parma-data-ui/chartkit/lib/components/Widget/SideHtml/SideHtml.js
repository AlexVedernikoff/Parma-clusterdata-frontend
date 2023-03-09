import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import {Button, Icon} from 'lego-on-react';
import IFrame from './IFrame/IFrame';

// import './SideHtml.scss';

const b = block('side-html');

export default class SideHtml extends React.PureComponent {
    static propTypes = {
        html: PropTypes.string,
        visible: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {visible: this.props.visible};
    }

    _toggleVisible = () => {
        this.setState({visible: !this.state.visible});
    };

    _renderSide = () => (
        <div className={b()}>
            <Button theme="clear" mix={{block: b('hide')}} onClick={this._toggleVisible}>
                <Icon glyph="type-cross" mix={{block: b('cross')}}/>
            </Button>
            <IFrame className={b('body')} sandbox="allow-same-origin allow-scripts allow-popups">
                <div dangerouslySetInnerHTML={{__html: this.props.html}}/>
            </IFrame>
        </div>
    );

    render() {
        return this.state.visible ? this._renderSide() : null;
    }
}
