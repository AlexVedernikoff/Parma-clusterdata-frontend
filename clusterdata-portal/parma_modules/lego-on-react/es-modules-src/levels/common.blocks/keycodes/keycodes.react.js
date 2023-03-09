var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { decl } from '@parma-lego/i-bem-react';

var keysMap = {
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

export default decl({
    block: 'keycodes'
}, _extends({}, keysMap, {

    /**
     * Возвращает список клавиш.
     *
     * @returns {String[]}
     */
    list: function list() {
        return Object.keys(keysMap);
    },


    /**
     * Проверка соответствия кода клавиши одному из переданных названий.
     *
     * @example
     * Keycodes.is(e.keyCode, 'SPACE', 'ENTER');
     *
     * @param {Number} code Код клавиши.
     * @param {...String|String[]} name Названия клавиш.
     * @returns {Boolean}
     */
    is: function is(code, name) {
        return (Array.isArray(name) ? name : Array.prototype.slice.call(arguments, 1)).some(function (name) {
            return this[name] === code;
        }, this);
    }
}));