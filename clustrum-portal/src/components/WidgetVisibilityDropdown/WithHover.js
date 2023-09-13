import React from 'react';

export function WithHover(Component, props, text) {
  return class WithHover extends React.Component {
    state = { hovering: false };
    mouseOver = () => {
      if (!this.state.hovering) {
        this.setState({ hovering: true });
      }
    };
    mouseOut = () => {
      this.setState({ hovering: false });
    };
    render() {
      return (
        <div onMouseEnter={this.mouseOver} onMouseLeave={this.mouseOut}>
          <Component hovering={this.state.hovering} {...props} text={text} />
        </div>
      );
    }
  };
}
