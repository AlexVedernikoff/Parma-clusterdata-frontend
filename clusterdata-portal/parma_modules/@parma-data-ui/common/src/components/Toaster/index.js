import React from 'react';
import ReactDOM from 'react-dom';
import block from 'bem-cn-lite';
import ToastsContainer from './ToastsContainer';
import constants from './constants';


const TOASTER_KEY = Symbol('Toaster instance key');
const bToaster = block(constants.cNameToaster);

export default class Toaster {
    constructor() {
        if (window[TOASTER_KEY]) {
            return window[TOASTER_KEY];
        }

        this._toasts = [];
        this._createRootNode();
        this._render();

        window[TOASTER_KEY] = this;
    }

    createToast = async toastOptions => {
        const {name} = toastOptions;
        const index = this._getToastIndex(name);

        if (index !== -1) {
            await this.removeToast(name);
        }

        this._toasts.push(toastOptions);

        this._render(name);
    };

    removeToast = name => {
        const index = this._getToastIndex(name);

        if (index === -1) {
            return;
        }

        this._removeToastFromDOM(name);
    };

    overrideToast = (name, overrideOptions) => {
        const index = this._getToastIndex(name);

        if (index === -1) {
            return;
        }

        this._toasts[index] = {
            ...this._toasts[index],
            ...overrideOptions,
            isOverride: true
        };

        this._render();
    };

    _removeToastFromDOM(name) {
        const index = this._getToastIndex(name);
        this._toasts.splice(index, 1);
        this._render();
    }

    _getToastIndex = name => {
        return this._toasts.findIndex(toast => toast.name === name);
    };

    _createRootNode() {
        this._rootNode = document.createElement('div');
        this._rootNode.className = bToaster();
        document.body.appendChild(this._rootNode);
    }

    _render() {
        ReactDOM.render(
            <ToastsContainer
                toasts={this._toasts}
                removeCallback={this.removeToast}
            />, this._rootNode, () => Promise.resolve());
    }
}
