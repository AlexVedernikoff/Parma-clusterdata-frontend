import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import {Button, TextInput} from 'lego-on-react';
import trans from '../i18n';

// import './Search.scss';


const b = block('yc-select-search');

export default class Search extends React.PureComponent {
    static propTypes = {
        value: PropTypes.string,
        width: PropTypes.number,
        minWidth: PropTypes.number,
        searchButtonSettings: PropTypes.object,
        onInputChange: PropTypes.func,
        selectAllItems: PropTypes.func
    };

    componentDidMount() {
        this.focusInput();
    }

    focusInput = () => {
        const {scrollX, scrollY} = window;
        const scrollTop = document.body.scrollTop;
        this.inputNode.focus();
        // для нормальных браузеров
        window.scrollTo(scrollX, scrollY);
        // для Safari
        document.body.scrollTop = scrollTop;
    };

    _setInputNode = ref => {
        this.inputNode = ref;
    };

    render() {
        const {
            value,
            width,
            minWidth,
            searchButtonSettings: {
                isCleaning,
                visible
            },
            onInputChange,
            selectAllItems
        } = this.props;

        return (

            <div
                className={b()}
                style={{
                    width,
                    minWidth
                }}
                onClick={this.focusInput}
            >
                <div className={b('input-wrap')}>
                    <TextInput
                        innerRef={this._setInputNode}
                        theme="normal"
                        size="s"
                        view="default"
                        tone="default"
                        text={value}
                        placeholder={trans('search_placeholder')}
                        onChange={onInputChange}
                        hasClear
                    />
                </div>
                {
                    visible && (
                        <Button
                            cls={b('select-all-button')}
                            theme="flat"
                            size="s"
                            view="default"
                            tone="default"
                            text={isCleaning ? trans('search_clear') : trans('search_select_all')}
                            onClick={selectAllItems}
                        />
                    )
                }
            </div>
        );
    }
}
