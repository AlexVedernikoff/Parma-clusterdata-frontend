import React from 'react';
import PropTypes from 'prop-types';
import { declMod } from '@parma-lego/i-bem-react';
import _userAccount__accentLetter from "../__accent-letter/user-account__accent-letter.react.js";

var UserAccountAccentLetter = _userAccount__accentLetter.applyDecls();

//import "./../../__accent-letter/user-account__accent-letter.css";


export default declMod({ hasAccentLetter: true }, {
    block: 'user-account',
    elem: 'name',
    content: function content(_ref) {
        var text = _ref.text,
            children = _ref.children;

        if (text && !children) {
            var name = String(text);

            return [React.createElement(
                UserAccountAccentLetter,
                { key: 'accent-letter' },
                name.charAt(0)
            ), name.slice(1)];
        }

        return children;
    }
}, {
    propTypes: {
        text: PropTypes.string
    }
});