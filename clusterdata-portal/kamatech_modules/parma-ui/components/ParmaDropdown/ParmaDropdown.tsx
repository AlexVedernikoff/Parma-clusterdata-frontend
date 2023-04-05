import * as React from 'react';
import './ParmaDropdown.css';
import { Portal } from 'react-portal';
import { ParmaPopup } from '../ParmaPopup/ParmaPopup';

export class ParmaDropdown extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.switcherRef = React.createRef();
    this.state = {
      opened: false,
    };
  }

  switcherRef: React.RefObject<any>;

  onClick() {
    const opened = !this.state.opened;
    this.setState({ opened });
  }

  clickOutside() {
    this.setState({ opened: false });
  }

  render() {
    const switcher = React.cloneElement(this.props.switcher, { onClick: this.onClick.bind(this) });
    return (
      <React.Fragment>
        <div ref={this.switcherRef}>{switcher}</div>
        {this.state.opened && (
          <Portal>
            <ParmaPopup
              popupClass={'parma-dropdown-popup'}
              anchor={this.switcherRef.current}
              clickOutside={this.clickOutside.bind(this)}
            >
              {this.props.popup}
            </ParmaPopup>
          </Portal>
        )}
      </React.Fragment>
    );
  }
}
