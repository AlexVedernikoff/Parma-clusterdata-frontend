import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import {Button} from 'lego-on-react';

import {ERROR_TYPE} from '../../../modules/error-dispatcher/error-dispatcher';
import More from '../More/More';

import {i18nV2 as i18nFactory} from '../../../modules/i18n/i18n';
import {URL_OPTIONS} from '../../../modules/constants/constants';

import * as keyset from '../i18n';

// import '../Error.scss';

const i18n = i18nFactory(keyset);
const b = block('chartkit-error');

function handler(handledError) {
    const {type, error, extra = {}} = handledError;

    switch (extra.error && extra.error.errorType || type) {
        case ERROR_TYPE.CONFIG_LOADING_ERROR:
            if (extra.error && extra.error.code) {
                switch (extra.error.code) {
                    case 403:
                        return {title: i18n('error-no-view-rights')};
                    case 404:
                        return {
                            title: i18n('error-not-found'),
                            more: (extra.error && extra.error.messageError ? extra.error.messageError : '') || extra.executionError || extra.stackTrace
                        };
                }
            }
            return {title: i18n('error-not-loaded')};
        case ERROR_TYPE.TOO_MANY_LINES:
            return {
                title: i18n('error-too-many-lines'),
                retryText: i18n('error-anyway'),
                retryParams: {[URL_OPTIONS.WITHOUT_LINE_LIMIT]: 1}
            };
        case ERROR_TYPE.NO_DATA:
            return {title: i18n('error-no-data')};
        case ERROR_TYPE.RENDER_ERROR:
            console.error(error);
            return {title: i18n('error-render')};
        case ERROR_TYPE.UNSUPPORTED_EXTENSION:
            console.error(extra.error && extra.error.stackTrace);

            return {
                title: i18n('error-unsupported-extension'),
                more: (extra.error && extra.error.messageError ? extra.error.messageError : '') || extra.executionError || extra.stackTrace
            };
        case ERROR_TYPE.EXECUTION_ERROR: {
            console.error(extra.tabName, extra.executionError || extra.stackTrace);

            return {
                title: i18n('error-processing'),
                more: (extra.error && extra.error.messageError ? extra.error.messageError : '') || extra.executionError || extra.stackTrace
            };
        }
        case ERROR_TYPE.EXCEEDED_DATA_LIMIT: {
            console.error(extra.tabName, extra.executionError || extra.stackTrace);

            return {
                title: i18n('exceeded-data-limit'),
                more: (extra.error && extra.error.messageError ? extra.error.messageError : '') || extra.executionError || extra.stackTrace
            }
        }
        case ERROR_TYPE.UNKNOWN_ERROR:
            return {title: i18n('error-unknown')};
        default:
            console.error(handledError);
            return handledError;
    }
}

function Simple(originalProps) {
    const props = {extraLines: [], retryParams: {}, ...originalProps, ...handler(originalProps.data.error)};
    const type = originalProps.data.error.type;

    return (
        <div className={b({ [type]: Boolean(type) })}>
            <div className={b('title')}>
                {props.title || i18n('unexpected')}
            </div>

            <div className={b('retry')}>
                <Button
                    theme="action"
                    tone="default"
                    view="default"
                    size="m"
                    onClick={() => props.retryClick(props.retryParams)}
                >
                    {props.retryText || i18n('retry')}
                </Button>

                {props.more ?
                    <More requestId={props.requestId} text={props.more}/> :
                    null
                }
            </div>
        </div>
    );
}

Simple.propTypes = {
    isEditMode: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    requestId: PropTypes.string.isRequired,
    retryClick: PropTypes.func.isRequired
};

export default Simple;
