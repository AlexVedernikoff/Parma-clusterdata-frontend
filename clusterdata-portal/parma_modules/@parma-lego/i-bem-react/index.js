'use strict';

var React = require('react');
var PropTypes = require('prop-types');
var origin = require('@bem/sdk.naming.presets').origin;
var core = require('bem-react-core/dist/core');

function bool2string(value) {
    return value ? 'yes' : false;
}

var _extends = Object.assign || function (target) {
    for(var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for(var key in source) {
            if(Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
};

var helpers = core({
    preset: {
        Render: function() {
            var args = [].slice.call(arguments);

            /**
             * @hack
             * Добавляем для всех элементов в props data-атрибут,
             * чтобы в i-bem игнорировать этот элемент
             */
            args[1] = _extends({'data-lego': 'react'}, args[1]);

            return React.createElement.apply(React, args);
        },
        Base: React.Component,
        classAttribute: 'className',
        PropTypes: PropTypes
    },
    naming: origin
});

// Добавляем bool2string как статическую функцию для обратной совместимости
React.Component.bool2string = bool2string;

module.exports = helpers.Bem;
module.exports.decl = helpers.decl;
module.exports.declMod = helpers.declMod;
module.exports.bool2string = bool2string;
