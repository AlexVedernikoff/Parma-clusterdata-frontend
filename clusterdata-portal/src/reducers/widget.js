import {i18n} from '@parma-data-ui/clusterdata';

import {
    REQUEST_WIDGET,
    RECEIVE_WIDGET,
    RESET_WIDGET
} from '../actions';

import sha1 from 'js-sha1';

import {
    versionExtractor
} from '../utils/helpers'

// Reducers

const initialState = {
    isLoading: false,
    widget: null,
    error: null
};

export function widget(state = initialState, action) {
    switch (action.type) {
        case RESET_WIDGET: {
            return initialState;
        }

        case REQUEST_WIDGET: {
            return {
                ...state,
                isLoading: true
            };
        }

        case RECEIVE_WIDGET: {
            const {data, error} = action;

            if (data) {
                let widgetData;
                if (data.data.shared) {
                    widgetData = JSON.parse(data.data.shared);
                } else {
                    widgetData = data.data;
                }

                const sortedWidgetData = {};
                Object.keys(widgetData).sort().forEach((key) => sortedWidgetData[key] = widgetData[key]);

                const version = JSON.stringify(sortedWidgetData, versionExtractor);
                const hash = sha1(version);

                return {
                    ...state,
                    widget: data,
                    hash,
                    isLoading: false
                };
            } else {
                return {
                    ...state,
                    isLoading: false,
                    error
                };
            }
        }

        default:
            return state;
    }
}

// Selectors

export const selectWidget = (state) => {
    return state.widget.widget || {
        fake: true,
        key: window.DL.user.login ? `/Users/${DL.user.login}/${i18n('wizard', 'label_new-widget')}` : `/${i18n('wizard', 'label_new-widget')}`,
        entryId: null
    };
};

export const selectIsWidgetLoading = (state) => state.widget.isLoading;
export const selectWidgetError = (state) => state.widget.error;
export const selectWidgetHash = (state) => state.widget.hash;
