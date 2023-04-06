import { decl } from '@kamatech-lego/i-bem-react';

export default decl({
  block: 'textinput',
  didMount: function didMount() {
    this.__base();
    if (this.props.autoFocus || this.state.focused) {
      this.focus();
    }
  },
});
