import * as React from 'react';
import './ParmaPopup.css';
import { PopupHelper, ClassHelper } from '../../helpers';
import { NodeModel } from '../../models';

export class ParmaPopup extends React.Component<any> {
  constructor(props: any) {
    super(props);
    this.popupRef = React.createRef();
  }

  popupRef: React.RefObject<any>;
  popup = new NodeModel();
  anchor = new NodeModel();

  render() {
    setTimeout(this.check.bind(this));
    return (
      <div
        className={ClassHelper.merge('parma-popup', this.props.popupClass)}
        style={this.getStyle}
        ref={this.popupRef}
      >
        {this.props.children}
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener('click', this.onOutsideClick.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onOutsideClick.bind(this));
  }

  private onOutsideClick(event: MouseEvent) {
    const popupEl = this.popupRef.current as HTMLElement;
    const anchorEl = this.props.anchor as HTMLElement;
    if (popupEl && anchorEl && event.target) {
      const isInPopup = PopupHelper.findParent(popupEl, event.target as HTMLElement);
      const isInAnchor = PopupHelper.findParent(anchorEl, event.target as HTMLElement);
      if (!isInPopup && !isInAnchor && this.props.clickOutside) {
        this.props.clickOutside();
      }
    }
  }

  get getStyle() {
    return {
      left: (this.popup && this.popup.left) || 0,
      top: (this.popup && this.popup.top) || 0,
      opacity: this.popup && this.anchor ? 1 : 0,
      visibility: (this.popup && this.anchor ? 'visible' : 'hidden') as any,
    };
  }

  private check() {
    const popupEl = this.popupRef.current as HTMLElement;
    const anchorEl = this.props.anchor as HTMLElement;
    if (popupEl && anchorEl) {
      const anchorOffset = PopupHelper.getOffsetElement(document.body, anchorEl);
      const needUpdate =
        !this.popup ||
        !this.anchor ||
        this.anchor.left !== anchorOffset.left ||
        this.anchor.top !== anchorOffset.top ||
        this.anchor.width !== anchorEl.offsetWidth ||
        this.anchor.height !== anchorEl.offsetHeight ||
        this.popup.width !== popupEl.offsetWidth ||
        this.popup.height !== popupEl.offsetHeight;

      if (needUpdate) {
        this.anchor = new NodeModel(anchorOffset.left, anchorOffset.top, anchorEl.offsetWidth, anchorEl.offsetHeight);
        this.popup = new NodeModel(0, 0, popupEl.offsetWidth, popupEl.offsetHeight);
        this.updatePosition();
      }
    }
  }

  private updatePosition() {
    const { offsetWidth, offsetHeight } = document.body;
    const { left, top } = PopupHelper.calcPositionOffset(this.anchor, this.popup, offsetWidth, offsetHeight);
    this.popup.left = left;
    this.popup.top = top;
    this.forceUpdate();
  }
}
