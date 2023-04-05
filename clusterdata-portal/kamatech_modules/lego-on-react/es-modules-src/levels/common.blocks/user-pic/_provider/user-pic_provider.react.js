import { declMod } from '@parma-lego/i-bem-react';

export default declMod(
  { provider: 'clusterdata' },
  {
    block: 'user-pic',
    getAvatarURL: function getAvatarURL() {
      var host = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var avatarId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';

      return {
        lodpiUrl: host + '/api/v1/user/' + avatarId + '/avatar/42.jpg',
        hidpiUrl: host + '/api/v1/user/' + avatarId + '/avatar/100.jpg',
      };
    },
  },
);
