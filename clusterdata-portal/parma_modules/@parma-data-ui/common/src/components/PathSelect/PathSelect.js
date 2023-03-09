import React from 'react';
import PropTypes from 'prop-types';
import NavigationMinimal from '../Navigation/NavigationMinimal';
import Icon from '../Icon/Icon';
import {Button} from 'lego-on-react';
import noop from 'lodash/noop';
import TextInput from '../TextInput/TextInput';
import iconFolder from '../../assets/icons/scope-folder.svg';
import iconChevronRight from '../../assets/icons/chevron-right.svg';
import EntryDialogues from '../EntryDialogues/EntryDialogues';

import {getPathDisplayName} from '../Navigation/util';

import block from 'bem-cn-lite';

// import './PathSelect.scss';

const b = block('yc-path-select');
const popupDirections = ['right-center', 'right-bottom', 'right-top'];
const btnMix = {block: b('button')};

// i18n
class PathSelect extends React.PureComponent {
    static propTypes = {
        sdk: PropTypes.object,
        defaultPath: PropTypes.string,
        withInput: PropTypes.bool,
        onChoosePath: PropTypes.func,
        onClick: PropTypes.func,
        inputRef: PropTypes.func,
        inputValue: PropTypes.string,
        placeholder: PropTypes.string,
        onChangeInput: PropTypes.func,
        getPathName: PropTypes.func,
        inactiveEntryKey: PropTypes.string,
        inputError: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool
        ]),
        size: PropTypes.string
    };

    static defaultProps = {
        defaultPath: '/',
        withInput: true,
        inputValue: '',
        rootName: 'Все файлы',
        placeholder: 'Название',
        onClick: noop,
        size: 'n'
    };

    static getPlaceParameters = undefined;

    static getDerivedStateFromProps(props, state) {
        if (state.defaultPath === props.defaultPath) {
            return state;
        } else {
            return {
                defaultPath: props.defaultPath,
                path: props.defaultPath
            };
        }
    }

    state = {
        visibleNav: false
    }

    refDialogues = React.createRef()

    onClose = event => {
        if (
            (this.btnRef && !this.btnRef.contains(event.target)) ||
            (event instanceof KeyboardEvent && event.code === 'Escape')
        ) {
            this.setState({visibleNav: false});
        }
    }

    onClick = () => {
        this.props.onClick();
        this.setState({visibleNav: !this.state.visibleNav});
    }

    setBtnRef = ref => {
        this.btnRef = ref;
    }

    get text() {
        const {defaultPath: path} = this.props;
        return getPathDisplayName({path});
    }

    onFocusTextInput = event => {
        const length = event.target.value.length;
        event.target.setSelectionRange(length, length);
    }

    onEntryClick = (entry) => {
        if (entry.isLocked) {
            this.unlockEntry(entry);
            return;
        }
        this.setState({path: entry.key});
    }

    onCrumbClick = (crumb) => {
        this.setState({path: crumb.path});
    }

    async unlockEntry(entry) {
        await this.refDialogues.current.openDialog({
            dialog: 'unlock',
            dialogProps: {
                entry
            }
        });
    }

    render() {
        if (typeof PathSelect.getPlaceParameters !== 'function') {
            console.warn('set static method getPlaceParameters for NavigationMinimal');
            return null;
        }
        return (
            <React.Fragment>
                <div className={b()}>
                    <div
                        className={b('button-place', {withInput: this.props.withInput})}
                        ref={this.setBtnRef}
                    >
                        <Button
                            theme="flat"
                            width="max"
                            view="default"
                            tone="default"
                            size={this.props.size}
                            onClick={this.onClick}
                            mix={btnMix}
                        >
                            <span className={b('button-content')}>
                                <Icon
                                    data={iconFolder}
                                />
                                <span className={b('path-text')}>
                                    {this.text}
                                </span>
                                {this.props.withInput && (
                                    <Icon data={iconChevronRight}/>
                                )}
                            </span>
                        </Button>
                    </div>
                    {this.props.withInput && (
                        <TextInput
                            error={this.props.inputError}
                            view="default"
                            tone="default"
                            theme="normal"
                            size={this.props.size}
                            innerRef={this.props.inputRef}
                            onFocus={this.onFocusTextInput}
                            onChange={this.props.onChangeInput}
                            placeholder={this.props.placeholder}
                            text={this.props.inputValue}
                            hasClear
                        />
                    )}
                    <NavigationMinimal
                        sdk={this.props.sdk}
                        path={this.state.path}
                        hasTail={true}
                        anchor={this.btnRef}
                        onClose={this.onClose}
                        visible={this.state.visibleNav}
                        popupDirections={popupDirections}
                        clickableScope="folder"
                        onChooseFolder={this.props.onChoosePath}
                        onEntryClick={this.onEntryClick}
                        onCrumbClick={this.onCrumbClick}
                        visibleButtonMenuEditEntry={false}
                        inactiveEntryKey={this.props.inactiveEntryKey}
                        getPlaceParameters={PathSelect.getPlaceParameters}
                    />
                </div>
                <EntryDialogues
                    ref={this.refDialogues}
                    sdk={this.props.sdk}
                />
            </React.Fragment>
        );
    }
}

export default PathSelect;
