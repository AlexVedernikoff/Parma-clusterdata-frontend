import { decl } from '@parma-lego/i-bem-react';

export default decl({
  block: 'textarea',
  didMount: function didMount() {
    this.__base();
    if (this.props.autoFocus || this.state.focused) {
      this.focus();
    }
  },
});
