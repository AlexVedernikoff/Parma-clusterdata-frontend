import React from 'react';
import PropTypes from 'prop-types';
import Bem, { decl, bool2string } from '@parma-lego/i-bem-react';

/*
import "./user-pic.css";
import "./_has-plus/user-pic_has-plus_yes.css";
 */

export default decl(
  {
    block: 'user-pic',
    mods: function mods(_ref) {
      var plus = _ref.plus;

      return {
        'has-plus': bool2string(plus),
      };
    },
    content: function content(_ref2) {
      var host = _ref2.host,
        avatarId = _ref2.avatarId,
        children = _ref2.children;

      if (children) {
        return children;
      }

      var _getAvatarURL = this.getAvatarURL(host, avatarId),
        lodpiUrl = _getAvatarURL.lodpiUrl,
        hidpiUrl = _getAvatarURL.hidpiUrl;

      return [
        React.createElement(Bem, {
          key: 'lodpi',
          block: 'user-pic',
          elem: 'image',
          mods: { lodpi: 'yes' },
          attrs: { style: { backgroundImage: 'url(' + lodpiUrl + ')' } },
        }),
        React.createElement(Bem, {
          key: 'hidpi',
          block: 'user-pic',
          elem: 'image',
          mods: { hidpi: 'yes' },
          attrs: { style: { backgroundImage: 'url(' + hidpiUrl + ')' } },
        }),
      ];
    },
    getAvatarURL: function getAvatarURL() {
      var host = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'https://avatars.mds.yandex.net';
      var avatarId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0/0-0';

      return {
        lodpiUrl: host + '/get-yapic/' + avatarId + '/islands-middle',
        hidpiUrl: host + '/get-yapic/' + avatarId + '/islands-retina-middle',
      };
    },
  },
  {
    propTypes: {
      provider: PropTypes.oneOf(['clusterdata']),
      host: PropTypes.string,
      avatarId: PropTypes.string,
      plus: PropTypes.bool,
    },
  },
);
