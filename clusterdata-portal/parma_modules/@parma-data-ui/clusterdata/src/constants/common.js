export const KeyCodes = {
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    CAPS_LOCK: 20,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    INSERT: 45,
    DELETE: 46
};

export const DL = {
    get IS_INTERNAL() {
        return window.DL.installationType === 'internal';
    },
    get USER_LOGIN() {
        return window.DL.user.login;
    },
    get USER_FOLDER() {
        return window.DL.user.login ? `Users/${this.USER_LOGIN}/` : '/';
    },
    get NAVIGATION_ENDPOINT() {
        return window.DL.endpoints.navigation;
    },
    get ENDPOINTS() {
        return window.DL.endpoints;
    },
    get USER_ID() {
        return `user:${window.DL.user.uid}`;
    }
};

export const ENTRY_TYPES = {
    legacyWizard: [
        'graph_wizard',
        'metric_wizard'
    ],
    legacyScript: [
        'graph',
        'table',
        'map',
        'module',
        'manager',
        'text',
        'metric',
        'graph_node',
        'table_node',
        'text_node',
        'metric_node',
        'map_node',
        'ymap_node',
        'control_node'
    ],
    wizard: [
        'graph_wizard_node',
        'table_wizard_node'
    ]
};

export const NOTIFY_TYPES = {
    ERROR: 'error',
    SUCCESS: 'success',
    INFO: 'info'
};

export const COOKIE_TOGGLE_THEME_NAME = 'dl_ui_theme';
export const COOKIE_TOGGLE_SWITCH_MODE_NAME = 'dl_superuser_switch_mode';

export const LIGHT_THEME_SELECTOR = 'yc-root_theme_light';
export const DARK_THEME_SELECTOR = 'yc-root_theme_dark';

export const LIGHT_THEME = 'light';
export const DARK_THEME = 'dark';

export const ENABLE = 'enable';
export const DISABLE = 'disable';

export const PERMISSION = {
    READ: 'acl_view',
    WRITE: 'acl_edit',
    ADMIN: 'acl_adm',
    EXECUTE: 'acl_execute'
};
