import { decl } from '@kamatech-lego/i-bem-react';

export default decl({
  block: 'pointerfocus',
  willInit: function willInit() {
    this.state = {
      block: 'utilityfocus',
    };
    this.timeoutId = 0;
    this.isPointer = false;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.setIsPointerOnTabFocus = this.setIsPointerOnTabFocus.bind(this);
  },
  onKeyDown: function onKeyDown(e) {
    clearTimeout(this.timeoutId);
    this.isPointer = false;
  },
  onMouseDown: function onMouseDown(e) {
    var _this = this;

    this.isPointer = true;
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(function() {
      _this.isPointer = false;
    }, 600);
  },
  onFocus: function onFocus(e) {
    // В IE classList.toggle не принимает второй аргумент, поэтому от него пришлось отказаться.
    if (this.isPointer) {
      document.body.classList.add('pointerfocus');
      document.body.classList.remove('utilityfocus');
    } else {
      document.body.classList.add('utilityfocus');
      document.body.classList.remove('pointerfocus');
    }

    this.setState({ block: this.isPointer ? 'pointerfocus' : 'utilityfocus' });
  },
  onBlur: function onBlur(e) {
    window.addEventListener('focus', this.setIsPointerOnTabFocus, true);
  },
  setIsPointerOnTabFocus: function setIsPointerOnTabFocus() {
    var _this2 = this;

    window.removeEventListener('focus', this.setIsPointerOnTabFocus, true);
    if (this.state.block !== 'pointerfocus') {
      return;
    }
    this.isPointer = true;
    setTimeout(function() {
      _this2.isPointer = false;
    });
  },
  didMount: function didMount() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('mousedown', this.onMouseDown);

    // В Chrome HTMLLabelElement после клика на себе производит синтетический
    // клик по связанному элементу, после чего на связанном элементе происходит focus.
    // При длинном клике isPointer успевает стать false, и вокруг элемента появляется
    // рамка фокуса. Обработчик на mouseup решает проблему.
    document.addEventListener('mouseup', this.onMouseDown);
    document.addEventListener('focus', this.onFocus, true);
    window.addEventListener('blur', this.onBlur);
    document.body.classList.add('utilityfocus');
  },
  willUnmount: function willUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mouseup', this.onMouseDown);

    document.removeEventListener('focus', this.onFocus, true);
    window.removeEventListener('blur', this.onBlur);
  },
  render: function render() {
    return null;
  },
});
