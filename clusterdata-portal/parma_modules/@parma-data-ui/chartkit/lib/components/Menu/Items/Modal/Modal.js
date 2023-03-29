import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Modal as LegoModal } from 'lego-on-react';

import Header from './Header/Header';
import Body from './Body/Body';
import Footer from './Footer/Footer';
import { Provider } from './Context/Context';

// import './Modal.scss';

const b = block('chartkit-modal');

class Modal extends React.PureComponent {
  static propTypes = {
    element: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired,
  };

  static Header = Header;
  static Body = Body;
  static Footer = Footer;

  onClose = () => ReactDOM.unmountComponentAtNode(this.props.element);

  render() {
    return (
      <LegoModal autoclosable visible={true} onOutsideClick={this.onClose}>
        <div className={b()}>
          <Provider onClose={this.onClose}>{this.props.children}</Provider>
        </div>
      </LegoModal>
    );
  }
}

export default Modal;
