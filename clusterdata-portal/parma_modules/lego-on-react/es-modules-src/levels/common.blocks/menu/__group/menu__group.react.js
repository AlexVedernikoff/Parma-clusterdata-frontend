import React from 'react';
import PropTypes from 'prop-types';
import Bem, { decl } from '@parma-lego/i-bem-react';

export default decl({
    block: 'menu',
    elem: 'group',
    tag: function tag(_ref) {
        var isNavigation = _ref.isNavigation;

        if (isNavigation) {
            return 'ul';
        }

        return this.__base();
    },
    attrs: function attrs() {
        return { role: 'group' };
    },
    content: function content(_ref2) {
        var title = _ref2.title,
            children = _ref2.children;

        var content = [];
        if (title) {
            content.push(React.createElement(
                Bem,
                {
                    block: this.block,
                    elem: 'title',
                    attrs: { 'aria-hidden': 'true' }
                },
                title
            ));
        }

        return [].concat(content, children).map(function (child, i) {
            return React.cloneElement(child, { key: 'in-group-' + i }); // eslint-disable-line react/no-array-index-key
        });
    }
}, {
    propTypes: {
        title: PropTypes.string
    },
    isGroup: function isGroup(child) {
        return child && typeof child.type === 'function' && child.type.displayName === 'menu__group';
    }
});