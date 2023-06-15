import React from 'react';

import cn from 'bem-cn-lite';

const b = cn('dl-dropdown-menu');

import List from './List/List';

// import './DropdownMenu.scss';

class DropdownMenu extends React.Component {
  static Hamburger = (
    <svg width={24} height={24} viewBox="0 0 24 24">
      <path fill="currentColor" d="M3,6H17V8H3V6M3,11H23V13H3V11M3,16H17V18H3V16Z" />
    </svg>
  );

  static ChevronUp = (
    <svg width={9} height={9} viewBox="0 0 9 9">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g stroke="#000000" strokeWidth="1.2">
          <polyline points="8 4.5 4.5 1 1 4.5 1 4.5"></polyline>
        </g>
      </g>
    </svg>
  );

  static ChevronDown = (
    <svg width={9} height={9} viewBox="0 0 9 9">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g stroke="#000000" strokeWidth="1.2">
          <polyline points="8 1 4.5 4.5 1 1 1 1"></polyline>
        </g>
      </g>
    </svg>
  );

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      selectedItemText: this.props.selectedItemText || null,
    };
  }

  getButtonContent() {
    return (
      <div onClick={this.props.action ? this.props.action : this.open}>
        {this.props.select
          ? this.state.selectedItemText || this.props.buttonText
          : this.props.buttonText || this.props.hamburger || DropdownMenu.Hamburger}
        {this.props.chevron ? (
          <div onClick={this.props.action ? this.open : null} className={b('icon')}>
            {this.state.visible ? DropdownMenu.ChevronUp : DropdownMenu.ChevronDown}
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }

  componentDidMount() {
    document.body.addEventListener('click', this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleOutsideClick, false);
  }

  open = () => {
    this.setState(prevState => ({
      visible: !prevState.visible,
      inited: true,
    }));

    return false;
  };

  handleOutsideClick = e => {
    if (this.menu) {
      if (this.menu.contains(e.target)) {
        return;
      }

      this.setState({ visible: false });
    }
  };

  render() {
    const { inited } = this.state;
    return (
      <div
        className={b.builder().is({ inited })()}
        ref={node => {
          this.menu = node;
        }}
      >
        <div className={b(`button${this.props.select ? '-select' : ''}`)}>
          {this.getButtonContent()}
        </div>
        <List
          data={this.props.data}
          visible={this.state.visible}
          wrapTo={this.props.wrapTo}
          onClick={event => {
            if (this.props.select) {
              this.setState({
                selectedItemText: event.target.textContent,
                visible: false,
              });
            }

            if (this.props.onClick) {
              this.props.onClick(event);
            }
          }}
        />
      </div>
    );
  }
}

export default DropdownMenu;
