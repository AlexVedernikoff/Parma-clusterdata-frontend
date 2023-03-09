import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import {TextInput, Button, Tooltip} from 'lego-on-react';
import {Icon} from '@parma-data-ui/common/src';

import {getEntryByIdOrKey} from '../../../helpers/utils-dash';

import iconTick from '@parma-data-ui/clusterdata/src/icons/tick.svg';
import iconSearchClear from '@parma-data-ui/clusterdata/src/icons/search-clear.svg';

import {i18n} from '@parma-data-ui/clusterdata';

// import './InputLink.scss';

const ERROR = {
    INPUT_LINK_INCORRECT: {
        key: 'INPUT_LINK_INCORRECT',
        get text() { return i18n('dash.navigation-input.edit', 'toast_incorrect-url'); }
    },
    INPUT_LINK_APPLY: {
        key: 'INPUT_LINK_APPLY',
        get text() { return i18n('dash.navigation-input.edit', 'toast_error'); }
    }
};

const b = block('input-link');

class InputLink extends React.PureComponent {
    static propTypes = {
        onApply: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        size: PropTypes.string
    };

    static defaultProps = {size: 'n'};

    state = {
        value: '',
        progress: false,
        error: null
    };

    applyButtonRef = React.createRef();

    onApply = async () => {
        let url;

        try {
            url = new URL(this.state.value);
        } catch (error) {
            this.setState({error: ERROR.INPUT_LINK_INCORRECT.key});
            return;
        }

        try {
            this.setState({progress: true});
            const entry = await getEntryByIdOrKey(url.pathname);

            const params = Array.from(url.searchParams.entries()).reduce((result, [key, value]) => {
                result[key] = result[key] || [];
                result[key].push(value);
                return result;
            }, {});

            this.props.onApply({entry, params});
        } catch (error) {
            console.error('INPUT_LINK_APPLY', error);
            this.setState({error: ERROR.INPUT_LINK_APPLY.key});
        }
        this.setState({progress: false});
    };

    render() {
        return (
            <div className={b()}>
                <TextInput
                    theme="normal"
                    view="default"
                    tone="default"
                    size={this.props.size}
                    placeholder={i18n('dash.navigation-input.edit', 'context_fill-link')}
                    text={this.state.value}
                    disabled={this.state.progress}
                    onChange={value => this.setState({value})}
                />
                <Button
                    theme="normal"
                    view="default"
                    tone="default"
                    size="xs"
                    width="max"
                    disabled={this.state.progress}
                    onClick={this.props.onCancel}
                    cls={b('button')}
                >
                    <Icon data={iconSearchClear} width="16"/>
                </Button>
                <Button
                    theme="action"
                    view="default"
                    tone="default"
                    size="xs"
                    width="max"
                    progress={this.state.progress}
                    onClick={this.onApply}
                    ref={this.applyButtonRef}
                    cls={b('button')}
                >
                    <Icon data={iconTick} width="16"/>
                </Button>
                <Tooltip
                    theme="error"
                    view="classic"
                    size="n"
                    autoclosable
                    anchor={this.applyButtonRef.current}
                    visible={Boolean(this.state.error)}
                    to="bottom-right"
                    onOutsideClick={() => this.setState({error: null})}
                >
                    {this.state.error && ERROR[this.state.error].text}
                </Tooltip>
            </div>
        );
    }
}

export default InputLink;
