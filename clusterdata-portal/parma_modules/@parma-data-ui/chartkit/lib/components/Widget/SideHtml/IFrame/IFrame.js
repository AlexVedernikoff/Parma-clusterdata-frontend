import React from 'react';
import ReactDOM from 'react-dom';

const styles = `
    body {
        font-family: Helvetica, Arial, sans-serif;
        margin: 0;
    }
`;

export default class Frame extends React.PureComponent {
  componentDidMount() {
    setTimeout(this._renderChildren, 0);
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.innerNode);
  }

  _renderChildren = () => {
    const head = this.iframeNode.contentDocument.head;
    const style = document.createElement('style');
    const cssNode = document.createTextNode(styles);
    style.appendChild(cssNode);
    head.appendChild(style);

    const body = this.iframeNode.contentDocument.body;
    this.innerNode = document.createElement('div');
    body.appendChild(this.innerNode);

    ReactDOM.render(this.props.children, this.innerNode);
  };

  render() {
    const { children, ...props } = this.props;
    return (
      <iframe
        {...props}
        ref={node => {
          this.iframeNode = node;
        }}
      />
    );
  }
}
