"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.I18N = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var I18N =
/*#__PURE__*/
function () {
  function I18N() {
    var _this$data;

    (0, _classCallCheck2["default"])(this, I18N);
    this.data = (_this$data = {}, (0, _defineProperty2["default"])(_this$data, I18N.LANGS.ru, {}), (0, _defineProperty2["default"])(_this$data, I18N.LANGS.en, {}), _this$data);
  }

  (0, _createClass2["default"])(I18N, [{
    key: "registerKeyset",
    value: function registerKeyset(lang, keysetName) {
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (this.data[lang] && this.data[lang].hasOwnProperty(keysetName)) {
        throw new Error("Keyset '".concat(keysetName, "' is already registered, aborting!"));
      }

      this.data[lang] = Object.assign({}, this.data[lang], (0, _defineProperty2["default"])({}, keysetName, data));
    }
  }, {
    key: "registerKeysets",
    value: function registerKeysets(lang, data) {
      var _this = this;

      Object.keys(data).forEach(function (keysetName) {
        _this.registerKeyset(lang, keysetName, data[keysetName]);
      });
    }
  }, {
    key: "i18n",
    value: function i18n(keysetName, key, params) {
      var language = this.data[I18N.lang];

      if (typeof language === "undefined") {
        throw new Error("Language '".concat(I18N.lang, "' is not defined, make sure you call setLang for the same language you called registerKeysets for!"));
      }

      var keyValue = language[keysetName] && language[keysetName][key];
      var result;

      if (typeof keyValue === 'undefined') {
        console.warn('No value for i18n key:', keysetName, key);
        return key;
      }

      if (params) {
        var count = Number(params.count);

        if (Array.isArray(keyValue)) {
          if (typeof count !== 'number') {
            console.warn('No params.count for i18n key:', keysetName, key);
            return key;
          }

          var lastNumber = count % 10;
          var lastNumbers = count % 100;
          var index;

          if (count === 0) {
            index = 3;
          } else if (lastNumber === 1 && lastNumbers !== 11) {
            index = 0;
          } else if (lastNumber > 1 && lastNumber < 5 && (lastNumbers < 10 || lastNumbers > 20)) {
            index = 1;
          } else {
            index = 2;
          }

          result = keyValue[index];
        } else {
          result = keyValue;
        }

        Object.keys(params).forEach(function (param) {
          result = (result || '').replace(new RegExp("({{".concat(param, "}})"), 'g'), params[param]);
        });
      } else {
        result = keyValue;
      }

      return result;
    }
  }, {
    key: "keyset",
    value: function keyset(keysetName) {
      var _this2 = this;

      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _this2.i18n.apply(_this2, [keysetName].concat(args));
      };
    }
  }], [{
    key: "setLang",
    value: function setLang(lang) {
      I18N.lang = lang;
    }
  }]);
  return I18N;
}();

exports.I18N = I18N;
I18N.LANGS = {
  ru: 'ru',
  en: 'en'
};
I18N.lang = I18N.LANGS.ru;