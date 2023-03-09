import React from 'react';
import PropTypes from 'prop-types';
import Bem, { decl, bool2string } from '@parma-lego/i-bem-react';
import "../icon/icon.react.js";
import "../icon/_glyph/icon_glyph.react.js";
import _icon_glyph_typeClose from "../icon/_glyph/icon_glyph_type-close.react.js";

var Icon = _icon_glyph_typeClose.applyDecls();

/*
import "./../icon/icon.css";
import "./../icon/_glyph/icon_glyph.css";
import "./../icon/_glyph/icon_glyph_type-close.css";
 */


export default decl({
    block: 'user-hat',

    willInit: function willInit(_ref) {
        var _ref$banner = _ref.banner,
            banner = _ref$banner === undefined ? {} : _ref$banner,
            hidden = _ref.hidden;
        var _banner$background = banner.background,
            bg = _banner$background === undefined ? '' : _banner$background,
            _banner$closeUrl = banner.closeUrl,
            closeUrl = _banner$closeUrl === undefined ? '' : _banner$closeUrl,
            _banner$foreground = banner.foreground,
            fg = _banner$foreground === undefined ? '' : _banner$foreground,
            _banner$text = banner.text,
            text = _banner$text === undefined ? '' : _banner$text,
            _banner$title = banner.title,
            title = _banner$title === undefined ? '' : _banner$title,
            _banner$transformOrig = banner.transformOrigin,
            origin = _banner$transformOrig === undefined ? '' : _banner$transformOrig,
            _banner$showUrl = banner.showUrl,
            showUrl = _banner$showUrl === undefined ? '' : _banner$showUrl,
            _banner$url = banner.url,
            url = _banner$url === undefined ? '' : _banner$url;


        var urlParams = this.stringifyParams_(banner.urlParams);

        this.state = {
            bannerUrl: this.constructUrl_(url, urlParams),
            bg: bg,
            closeUrl: closeUrl,
            fg: fg,
            hidden: hidden,
            origin: origin,
            showUrl: showUrl,
            text: text,
            title: title,
            urlParams: urlParams
        };

        this.onCloseButtonClick_ = this.onCloseButtonClick_.bind(this);
        this.onBannerClick_ = this.onBannerClick_.bind(this);
        this.onBannerShow_ = this.onBannerShow_.bind(this);
    },
    willReceiveProps: function willReceiveProps(_ref2) {
        var hidden = _ref2.hidden;

        if (hidden !== this.props.hidden) {
            this.setState({ hidden: hidden });

            // Предполагается, что баннер либо виден изначально, и тогда
            // картинка вставляется в didMount, либо единожды
            // приходит hidden: false и картинка вставляется в этот момент.
            if (!hidden) {
                this.onBannerShow_();
                this.insertHiddenImage_(this.state.showUrl, 'show-img');
            }
        }
    },
    didMount: function didMount() {
        if (!this.props.hidden) {
            this.onBannerShow_();
            this.insertHiddenImage_(this.state.showUrl, 'show-img');
        }
    },
    mods: function mods() {
        return {
            hidden: bool2string(this.state.hidden)
        };
    },
    close: function close() {
        this.insertHiddenImage_(this.state.closeUrl, 'close-img');
        this.setState({ hidden: true });
    },
    onCloseButtonClick_: function onCloseButtonClick_(e) {
        this.close();
        this.props.onCloseButtonClick && this.props.onCloseButtonClick(e);
    },
    onBannerClick_: function onBannerClick_(e) {
        this.props.onBannerClick && this.props.onBannerClick(e);
    },
    onBannerShow_: function onBannerShow_(e) {
        this.props.onBannerShow && this.props.onBannerShow(e);
    },
    constructUrl_: function constructUrl_(url) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        if (!url) {
            return '';
        }

        if (!params) {
            return url;
        }

        return url.indexOf('?') !== -1 ? url + '&' + params : url + '?' + params;
    },
    insertHiddenImage_: function insertHiddenImage_(url, imageName) {
        var i = document.createElement('img');
        i.setAttribute('src', url);
        i.style.display = 'none';
        i.classList.add('user-hat__' + imageName);
        document.body.appendChild(i);
    },
    stringifyParams_: function stringifyParams_() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        return Object.keys(params).reduce(function (result, param) {
            param = param + '=' + params[param];
            return result.concat(param);
        }, []).join('&');
    },
    content: function content() {
        return [React.createElement(
            Bem,
            {
                attrs: {
                    href: this.state.bannerUrl,
                    target: '_blank'
                },
                block: 'user-hat',
                elem: 'remote',
                key: 'remote',
                onClick: this.onBannerClick_,
                tag: 'a' },
            React.createElement(
                Bem,
                { block: 'user-hat', elem: 'title' },
                this.state.title
            ),
            React.createElement(
                Bem,
                { block: 'user-hat', elem: 'text' },
                this.state.text
            ),
            React.createElement(Bem, { block: 'user-hat', elem: 'bg', attrs: {
                    style: {
                        backgroundImage: 'url(' + this.state.bg + ')',
                        transformOrigin: this.state.origin + ' 0'
                    }
                } }),
            React.createElement(Bem, { block: 'user-hat', elem: 'fg', attrs: { style: { backgroundImage: 'url(' + this.state.fg + ')' } } })
        ), React.createElement(
            Bem,
            {
                key: 'close-button',
                onClick: this.onCloseButtonClick_,
                block: 'user-hat',
                elem: 'close-button' },
            React.createElement(Icon, { glyph: 'type-close' })
        )];
    }
}, {
    propTypes: {
        banner: PropTypes.object,
        fetchData: PropTypes.bool,
        fetchUrl: PropTypes.string,
        fetchUrlParams: PropTypes.object,
        hidden: PropTypes.bool
    }
});