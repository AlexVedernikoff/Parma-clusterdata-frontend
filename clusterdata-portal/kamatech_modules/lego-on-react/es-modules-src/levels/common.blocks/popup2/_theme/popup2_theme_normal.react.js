import { declMod } from '@parma-lego/i-bem-react';

export default declMod(
  { theme: 'normal' },
  {
    block: 'popup2',
    willInit: function willInit() {
      this.__base.apply(this, arguments);

      this.defaultMainOffset = 5;
      this.defaultViewportOffset = 5;
    },
  },
);
