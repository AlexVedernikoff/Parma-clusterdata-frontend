import { declMod } from '@parma-lego/i-bem-react';

export default declMod(
  { theme: 'websearch' },
  {
    block: 'textinput',
    elem: 'clear',
    iconType: function iconType() {
      return 'cross-websearch';
    },
  },
);
