/* eslint-disable */
ace.define('ace/theme/clustrum', ['require', 'exports', 'module', 'ace/lib/dom'], function (acequire, exports) {
  exports.isDark = false;
  exports.cssClass = 'ace-clustrum';
  exports.cssText = ``;

  var dom = acequire('../lib/dom');
  dom.importCssString(exports.cssText, exports.cssClass);
});
