import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import {Button, Spin} from 'lego-on-react';

const b = block('data-source-button');

export const DataSourceButton = ({
    disabled = false,
    label = '',
    cls = '',
    text,
    isLoading = false,
    onClick
}) => {
    return (
        <React.Fragment>
            {label && <div className={b('caption', b('margin', {bottom: 5}))}>
                <span>{label}</span>
            </div>}
            <Button
                disabled={disabled}
                cls={cls}
                size="s"
                theme="pseudo"
                tone="default"
                view="default"
                onClick={onClick}
            >
                {
                    isLoading ? (
                        <div className={b('loader')}>
                            <Spin size="xxs" progress/>
                        </div>
                    ) : (<span>{text}</span>)
                }
            </Button>
        </React.Fragment>
    );
};

DataSourceButton.propTypes = {
    disabled: PropTypes.bool,
    label: PropTypes.string,
    cls: PropTypes.string,
    text: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    onClick: PropTypes.func
};
