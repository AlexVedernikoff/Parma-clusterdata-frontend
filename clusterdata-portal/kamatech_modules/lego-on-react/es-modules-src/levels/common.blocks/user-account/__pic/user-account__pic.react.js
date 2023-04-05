import React from 'react';
import PropTypes from 'prop-types';
import { decl } from '@kamatech-lego/i-bem-react';
import '../../user-pic/user-pic.react.js';
import _userPic_provider_yandexTeam from '../../user-pic/_provider/user-pic_provider.react.js';

var UserPic = _userPic_provider_yandexTeam.applyDecls();

//import "./../../user-pic/user-pic.css";

export default decl(
  {
    block: 'user-account',
    elem: 'pic',
    render: function render() {
      var block = this.block,
        elem = this.elem,
        _props = this.props,
        pic = _props.pic,
        avatarId = _props.avatarId,
        avatarHost = _props.avatarHost,
        provider = _props.provider,
        plus = _props.plus;

      if (pic) {
        return React.createElement(UserPic, {
          plus: plus,
          avatarId: avatarId,
          provider: provider,
          host: avatarHost,
          mix: { block: block, elem: elem, mods: this.mods(this.props) },
        });
      }

      return this.__base.apply(this, arguments);
    },
  },
  {
    propTypes: {
      avatarId: PropTypes.string,
      avatarHost: PropTypes.string,
    },
  },
);
