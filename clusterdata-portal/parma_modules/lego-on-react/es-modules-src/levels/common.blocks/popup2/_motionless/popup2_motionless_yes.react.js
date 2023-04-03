import { declMod } from '@parma-lego/i-bem-react';

export default declMod(
  { motionless: true },
  {
    block: 'popup2',

    /**
     * @override
     */
    didMount: function didMount() {
      this.__base();
      // При motionless нам не нужно пересчитывать положение,
      // поэтому мы просто отписываемся от событий которые вызывают forceUpdate
      // нельзя использовать метод toggleWatchBaseEvents,
      // т.к. он доопределяется в модификаторе target_anchor
      window.removeEventListener('scroll', this._onWinScrollAndResize);
      window.removeEventListener('resize', this._onWinScrollAndResize);
    },

    /**
     * @override
     */
    willReceiveProps: function willReceiveProps() {
      this.__base.apply(this, arguments);
      window.removeEventListener('scroll', this._onWinScrollAndResize);
      window.removeEventListener('resize', this._onWinScrollAndResize);
    },

    /**
     * @override
     */
    _onWinScrollAndResize: function _onWinScrollAndResize() {
      // Переопределяем функцию,
      // т.к. в тестовом окружении didMount и willReceiveProps не вызываются,
      // поэтому мы не можем отписаться от событий
    },
  },
);
