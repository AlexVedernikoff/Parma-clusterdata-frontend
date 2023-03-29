var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

import { declMod } from '@parma-lego/i-bem-react';

export default declMod(
  function(_ref) {
    var fetchData = _ref.fetchData;
    return fetchData;
  },
  {
    block: 'user-hat',
    willInit: function willInit(_ref2) {
      var fetchUrl = _ref2.fetchUrl,
        fetchUrlParams = _ref2.fetchUrlParams,
        _ref2$hidden = _ref2.hidden,
        hidden = _ref2$hidden === undefined ? true : _ref2$hidden;

      this.__base.apply(this, arguments);

      var fetchParams = this.stringifyParams_(fetchUrlParams);

      this.state.fetchUrl = this.constructUrl_(fetchUrl, fetchParams);

      this.fetchData = this.fetchData.bind(this);
      this.setContent = this.setContent.bind(this);
    },
    willReceiveProps: function willReceiveProps(_ref3) {
      var ready = _ref3.ready;

      this.__base.apply(this, arguments);

      if (ready && !this.props.ready) {
        this.fetchData();
      }
    },
    didMount: function didMount() {
      this.__base.apply(this, arguments);

      if (this.props.ready) {
        this.fetchData();
      }
    },
    mods: function mods() {
      return _extends({}, this.__base.apply(this, arguments), {
        'fetch-data': 'yes',
      });
    },
    fetchData: function fetchData() {
      var _this = this;

      var _props = this.props,
        _props$onSuccess = _props.onSuccess,
        onSuccess = _props$onSuccess === undefined ? function() {} : _props$onSuccess,
        _props$onFailure = _props.onFailure,
        onFailure = _props$onFailure === undefined ? function() {} : _props$onFailure;
      var fetchUrl = this.state.fetchUrl;

      if (!fetchUrl) {
        return;
      }
      var xhr = new XMLHttpRequest();

      xhr.open('GET', fetchUrl);
      xhr.withCredentials = true;
      xhr.send();
      xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) {
          return;
        }

        if (xhr.status !== 200) {
          onFailure();
        }

        if (xhr.status === 200) {
          var bannerData = JSON.parse(xhr.responseText);

          if (!bannerData || !bannerData.distribution) {
            return;
          }

          _this.setState({ showUrl: _this.constructShowUrl_(bannerData) });

          var rawBanner = _this.prepareData_(bannerData);

          _this.setContent(rawBanner);

          onSuccess();
        }
      };
    },
    setContent: function setContent(rawBanner) {
      var _rawBanner$title = rawBanner.title,
        title = _rawBanner$title === undefined ? '' : _rawBanner$title,
        _rawBanner$url = rawBanner.url,
        url = _rawBanner$url === undefined ? '' : _rawBanner$url,
        _rawBanner$text = rawBanner.text,
        text = _rawBanner$text === undefined ? '' : _rawBanner$text,
        _rawBanner$close_cnt = rawBanner.close_cnt,
        closeUrl = _rawBanner$close_cnt === undefined ? '' : _rawBanner$close_cnt,
        _rawBanner$bgImage_ = rawBanner.bgImage_2,
        bg = _rawBanner$bgImage_ === undefined ? '' : _rawBanner$bgImage_,
        _rawBanner$bgImage_2 = rawBanner.bgImage_1,
        fg = _rawBanner$bgImage_2 === undefined ? '' : _rawBanner$bgImage_2,
        _rawBanner$bgImageOri = rawBanner.bgImageOrigin_1,
        origin = _rawBanner$bgImageOri === undefined ? '' : _rawBanner$bgImageOri;

      // Предварительная загрузка на случай медленного соединения.

      var bgImg = document.createElement('img');
      bgImg.setAttribute('src', bg);

      var fgImg = document.createElement('img');
      fgImg.setAttribute('src', fg);

      this.setState({
        title: title,
        bannerUrl: this.constructUrl_(url, this.state.urlParams),
        closeUrl: closeUrl,
        text: text,
        bg: bg,
        fg: fg,
        origin: origin,
      });
    },
    constructShowUrl_: function constructShowUrl_(bannerData) {
      try {
        return bannerData.distribution.linkhead + bannerData.distribution.plus_popup[0].linknext || '';
      } catch (e) {
        return '';
      }
    },
    prepareData_: function prepareData_(bannerData) {
      var rawBanner = ([].concat(bannerData.distribution.plus_popup)[0] || {}).code;
      return rawBanner || {};
    },
  },
);
