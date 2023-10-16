import React from 'react';

export function WithHover(Component, props, text) {
  return class WithHover extends React.Component {
    state = { isHover: false };
    mouseEnter = () => {
      this.setState({ isHover: true });
    };
    mouseLeave = () => {
      this.setState({ isHover: false });
    };
    render() {
      return (
        <div
          onMouseEnter={this.mouseEnter}
          onMouseLeave={this.mouseLeave}
          style={{ position: 'relative' }}
        >
          <Component isHover={this.state.isHover} {...props} text={text} />
        </div>
      );
    }
  };
}
