import React from 'react';
import PropTypes from 'prop-types';

import {
    DARK_THEME,
    DARK_THEME_SELECTOR,
    LIGHT_THEME,
    LIGHT_THEME_SELECTOR,
    COOKIE_TOGGLE_THEME_NAME
} from '../../constants/common';
import Utils from '../../utils';
import {I18n} from '../../utils/i18n';


const i18n = I18n.keyset('clusterdata.header.view');
const NEXT_THEME_MAP = {
    [LIGHT_THEME]: DARK_THEME,
    [DARK_THEME]: LIGHT_THEME
};


function toggleTheme({theme}) {
    const classList = document.body.classList;

    classList.toggle(LIGHT_THEME_SELECTOR, theme === LIGHT_THEME);
    classList.toggle(DARK_THEME_SELECTOR, theme === DARK_THEME);
}

function getCurrentTheme({cookieThemeName}) {
    return Utils.getCookie(cookieThemeName) || LIGHT_THEME;
}

function getToggleThemeMenuItem() {
    const cookieThemeName = COOKIE_TOGGLE_THEME_NAME;

    const labelEnableDarkTheme = i18n('switch_enable-dark-theme');
    const labelEnableLightTheme = i18n('switch_enable-light-theme');

    const LABEL_TOGGLE_BUTTON = {
        [LIGHT_THEME]: labelEnableDarkTheme,
        [DARK_THEME]: labelEnableLightTheme
    };

    const currentTheme = getCurrentTheme({cookieThemeName});

    toggleTheme({theme: currentTheme});

    return {
        text: LABEL_TOGGLE_BUTTON[currentTheme],
        onClick: (e) => {
            const currentUserTheme = getCurrentTheme({cookieThemeName});
            const nextTheme = NEXT_THEME_MAP[currentUserTheme];

            toggleTheme({theme: nextTheme});

            e.currentTarget.innerText = LABEL_TOGGLE_BUTTON[nextTheme];

            Utils.setCookie({
                name: cookieThemeName,
                value: nextTheme
            });
        }
    };
}

const MAIL_MENU_ITEM = {
    action: 'mail'
};

const withToggleTheme = Component => {
    function WithToggleTheme(props) {
        const {
            toggleTheme = false,
            actionsMenu
        } = props;
        let actionsMenuNext = actionsMenu;

        if (toggleTheme && !actionsMenu) {
            const toggleThemeMenuItem = getToggleThemeMenuItem();

            actionsMenuNext = [
                toggleThemeMenuItem,
                MAIL_MENU_ITEM,
                ...(actionsMenuNext || [])
            ];
        }

        return (
            <Component
                {...props}
                actionsMenu={actionsMenuNext}
            />
        );
    }

    WithToggleTheme.propTypes = {
        toggleTheme: PropTypes.bool,
        toggleThemeMenuItem: PropTypes.object,
        actionsMenu: PropTypes.array
    };

    return WithToggleTheme;
};

export default withToggleTheme;
