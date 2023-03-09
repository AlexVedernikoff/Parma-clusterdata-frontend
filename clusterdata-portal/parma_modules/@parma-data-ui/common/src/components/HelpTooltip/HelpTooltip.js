import React, {Component} from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import {
    Button,
    Tooltip,
    Link
} from 'lego-on-react';

import Icon from '../Icon/Icon';


// import './HelpTooltip.scss';
import iconQuestionMark from '../../assets/icons/question-mark.svg';


const b = block('yc-help-tooltip');

function ControlIcon(props) {
    const {
        onClick
    } = props;

    return (
        <Icon
            data={iconQuestionMark}
            width={16}
            height={16}
            onClick={onClick}
        />
    );
}

function TooltipTitle(props) {
    const {title} = props;

    if (!title) {
        return null;
    }

    return (
        <h3 className={b('popup-title')}>
            {title}
        </h3>
    );
}

function TooltipContent(props) {
    const {
        tone,
        theme,
        content,
        htmlContent
    } = props;

    if (!htmlContent && !content) {
        return null;
    }

    if (htmlContent) {
        return (
            <div
                className={b('popup-content', {tone, theme})}
                dangerouslySetInnerHTML={{
                    __html: htmlContent
                }}
            />
        );
    }

    if (content) {
        return (
            <div className={b('popup-content', {tone})}>
                {content}
            </div>
        );
    }
}

function TooltipLinks(props) {
    const {links} = props;

    if (!links.length) {
        return null;
    }

    return (
        <div className={b('popup-links')}>
            {
                links.map((link, index) => {
                    const {
                        text,
                        url,
                        target = '_blank',
                        onClick
                    } = link;

                    return (
                        <React.Fragment
                            key={`link-${index}`}
                        >
                            <Link
                                cls={b('popup-link')}
                                theme="normal"
                                text={text}
                                url={url}
                                target={target}
                                onClick={onClick}
                            />
                            <br/>
                        </React.Fragment>
                    );
                })
            }
        </div>
    );
}

function TooltipButton(props) {
    const {
        size,
        tooltipButton
    } = props;

    if (!tooltipButton) {
        return null;
    }

    const {text, onClick} = tooltipButton;

    return (
        <Button
            cls={b('popup-button')}
            theme="normal"
            size={size}
            view="default"
            tone="default"
            width="max"
            text={text}
            onClick={onClick}
        />
    );
}


export default class HelpTooltip extends Component {
    static propTypes = {
        title: PropTypes.string,
        content: PropTypes.string,
        htmlContent: PropTypes.string,
        links: PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.shape({
                text: PropTypes.string.isRequired,
                url: PropTypes.string.isRequired,
                target: PropTypes.oneOf(['_self', '_blank'])
            }),
            PropTypes.shape({
                text: PropTypes.string.isRequired,
                onClick: PropTypes.func.isRequired
            })
        ])),
        tooltipButton: PropTypes.shape({
            text: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired
        }),
        theme: PropTypes.oneOf(['info', 'special']),
        to: Tooltip.propTypes.to,
        className: PropTypes.string,
        offset: PropTypes.shape({
            top: PropTypes.number,
            left: PropTypes.number
        }),
        autoclosable: PropTypes.bool,
        delayClosing: PropTypes.number,
        children: PropTypes.node
    };

    static defaultProps = {
        autoclosable: true,
        to: ['right-center', 'bottom-center'],
        theme: 'info',
        delayClosing: 300,
        offset: {
            left: 4
        },
        links: []
    };

    state = {
        visible: false
    };

    _controlRef = React.createRef();
    _delayClosing = null;
    _closedManually = false;

    toggleTooltip = () => {
        const nextVisible = !this.state.visible;

        this.setState({
            visible: nextVisible
        });

        if (!nextVisible) {
            this._closedManually = true;
        }
    };

    openTooltip = () => {
        this.setState({
            visible: true
        });
    };

    closeTooltip = () => {
        this._delayClosing = null;

        this.setState({
            visible: false
        });
    };

    onMouseOver = () => {
        const {autoclosable} = this.props;
        const {visible} = this.state;

        if (autoclosable && this._delayClosing) {
            clearTimeout(this._delayClosing);
            this._delayClosing = null;
        }

        if (!visible && !this._closedManually) {
            this.openTooltip();
        }
    };

    onMouseOut = () => {
        const {
            autoclosable,
            delayClosing
        } = this.props;

        if (autoclosable && !this._delayClosing) {
            this._delayClosing = setTimeout(this.closeTooltip, delayClosing);
        }

        this._closedManually = false;
    };

    render() {
        const {visible} = this.state;
        const {
            content,
            htmlContent,
            title,
            to,
            tooltipButton,
            theme,
            className,
            offset: {
                top,
                left
            } = {},
            children,
            links
        } = this.props;

        const size = 's';

        return (
            <div
                ref={this._controlRef}
                className={b(null, className)}
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseOut}
                style={{
                    top,
                    left
                }}
            >
                <ControlIcon
                    onClick={this.toggleTooltip}
                />
                <Tooltip
                    anchor={() => this._controlRef.current}
                    cls={b('popup')}
                    visible={visible}
                    theme="promo"
                    tone={theme}
                    to={to}
                    size={size}
                    onOutsideClick={this.closeTooltip}
                >
                    {
                        children ?
                            children :
                            (
                                <React.Fragment>
                                    <TooltipTitle title={title}/>
                                    <TooltipContent
                                        theme={theme}
                                        tone={title ? 'secondary' : 'primary'}
                                        content={content}
                                        htmlContent={htmlContent}
                                    />
                                    <TooltipLinks
                                        links={links}
                                    />
                                    <TooltipButton
                                        size={size}
                                        tooltipButton={tooltipButton}
                                    />
                                </React.Fragment>
                            )
                    }
                </Tooltip>
            </div>
        );
    }
}

ControlIcon.propTypes = {
    onClick: PropTypes.func.isRequired
};
TooltipTitle.propTypes = {
    title: HelpTooltip.propTypes.title
};
TooltipContent.propTypes = {
    theme: HelpTooltip.propTypes.theme,
    tone: PropTypes.oneOf(['primary', 'secondary']),
    content: HelpTooltip.propTypes.content,
    htmlContent: HelpTooltip.propTypes.htmlContent
};
TooltipLinks.propTypes = {
    links: HelpTooltip.propTypes.links
};
TooltipButton.propTypes = {
    tooltipButton: HelpTooltip.propTypes.tooltipButton
};
