var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import PropTypes from 'prop-types';
import { decl } from '@parma-lego/i-bem-react';

export default decl({
    block: 'user-account',
    elem: 'subname',
    tag: 'span',
    content: function content(_ref) {
        var subname = _ref.subname;

        return this.getSubname(subname);
    },
    getSubname: function getSubname(subname) {
        var providers = this.__self.PROVIDERS;

        subname = (typeof subname === 'undefined' ? 'undefined' : _typeof(subname)) === 'object' ? providers[subname.provider] : subname;

        return subname;
    }
}, {
    propTypes: {
        subname: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    },
    PROVIDERS: {
        fb: 'Facebook',
        tw: 'Twitter',
        mr: 'Mail.ru',
        gg: 'Google',
        ok: 'Odnoklassniki',
        vk: 'Vkontakte',
        dz: 'Deezer',
        fs: 'Foursquare',
        ig: 'Instagram',
        lf: 'Last.FM',
        lj: 'LiveJournal',
        'in': 'LinkedIn',
        mt: 'МТС-Россия',
        ms: 'Microsoft',
        yh: 'Yahoo',
        ya: 'Yandex',
        vf: 'Vodafone-Украина',
        tg: 'Telegram'
    }
});