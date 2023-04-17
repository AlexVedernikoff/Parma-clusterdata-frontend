import * as React from 'react';
import './KamatechDropdown.css';
import { Portal } from 'react-portal';
import { KamatechPopup } from '../KamatechPopup/KamatechPopup';

export class KamatechDropdown extends React.Component<any, any> {
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
            <KamatechPopup
              popupClass={'kamatech-dropdown-popup'}
              anchor={this.switcherRef.current}
              clickOutside={this.clickOutside.bind(this)}
            >
              {this.props.popup}
            </KamatechPopup>
          </Portal>
        )}
      </React.Fragment>
    );
  }
}
