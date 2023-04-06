import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Modal, Icon, Button } from 'lego-on-react';

// import './ChartsModal.scss';

const b = block('charts-modal');

export default class ChartsModal extends React.PureComponent {
  static propTypes = {
    element: PropTypes.object.isRequired, // DOM-элемент, на который был mountComponent
    onOutsideClick: PropTypes.func,
    mix: PropTypes.string,
  };

  static defaultProps = {
    mix: '',
  };

  static onClickClose = (event, element) => {
    if (event) {
      event.stopPropagation(); // github.com/facebook/react/issues/6232
    }
    ReactDOM.unmountComponentAtNode(element);
  };

  state = { visible: false };

  constructor(props) {
    super(props);

    // TODO: из-за старой версии островов на Трафе / ISL-3849
    setTimeout(this.setState.bind(this, { visible: true }), 0);
  }

  render() {
    return (
      <Modal
        autoclosable
        visible={this.state.visible}
        mix={{ block: b('z-index-hack') }}
        onOutsideClick={this._onClickClose}
      >
        <div className={b(false, this.props.mix)}>
          {this.props.children}
          <Button theme="clear" view="default" tone="default" size="head" onClick={this._onClickClose} cls={b('cross')}>
            <Icon glyph="type-cross" />
          </Button>
        </div>
      </Modal>
    );
  }

  _onClickClose = event => {
    if (this.props.onOutsideClick) {
      this.props.onOutsideClick();
    } else {
      ChartsModal.onClickClose(event, this.props.element);
    }
  };
}

ChartsModal.Section = props => <div className={b('section', props.mix)}>{props.children}</div>;
ChartsModal.Section.propTypes = {
  children: (props, propName) => {
    React.Children.forEach(props[propName], child => {
      if (child.type !== ChartsModal.Body && child.type !== ChartsModal.Header && child.type !== ChartsModal.Footer) {
        console.warn("children should be of type 'ChartsModal.Header', 'ChartsModal.Body', 'ChartsModal.Footer'.");
      }
    });
  },
  mix: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};
ChartsModal.Section.defaultProps = {
  mix: '',
};

ChartsModal.Header = props => <div className={b('header', props.mix)}>{props.children}</div>;
ChartsModal.Header.propTypes = {
  mix: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};
ChartsModal.Header.defaultProps = {
  mix: '',
};

ChartsModal.Body = props => <div className={b('body', props.mix)}>{props.children}</div>;
ChartsModal.Body.propTypes = {
  mix: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};
ChartsModal.Body.defaultProps = {
  mix: '',
};

ChartsModal.Footer = props => <div className={b('footer')}>{props.children}</div>;
