import { declMod } from '@kamatech-lego/i-bem-react';

export default declMod(
  { type: 'check' },
  {
    block: 'select2',
    _onMenuChange: function _onMenuChange(newVal, oldVal) {
      this.setState({ val: newVal });
      this._onChange(newVal);
    },
    _onMenuClick: function _onMenuClick(e, val) {
      // Если это было событие с клавиатуры,
      // нужно предотвратить закрытие.
      e.keyCode && (this._preventToToggleOpenedForce = true);
    },
  },
);
