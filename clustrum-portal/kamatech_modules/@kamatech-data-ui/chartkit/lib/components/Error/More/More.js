import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Button, Icon, Link, Modal } from 'lego-on-react';

import CopyToClipboard from '@kamatech-data-ui/react-components/src/components/CopyToClipboard';

import { i18nV2 as i18nFactory } from '../../../modules/i18n/i18n';

import * as keyset from '../i18n';

// import '../Error.scss';

const i18n = i18nFactory(keyset);
const b = block('chartkit-error');

class More extends React.PureComponent {
  static propTypes = {
    requestId: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  };

  anchorRef = React.createRef();

  onClose = () => ReactDOM.unmountComponentAtNode(this.anchorRef.current);

  onClick = () => {
    const text = `${this.props.requestId}

${JSON.stringify(this.props.text, null, 4)}`;

    ReactDOM.render(
      <Modal autoclosable visible={true} onOutsideClick={this.onClose}>
        <div className={b('modal')}>
          <div className={b('modal-header')}>
            {i18n('error-data-fetching')}
            <Link theme="ghost" onClick={this.onClose}>
              <Icon glyph="type-close" size="head" />
            </Link>
          </div>
          <div className={b('modal-body', b('code'))}>{text}</div>
          <div className={b('modal-footer')}>
            <CopyToClipboard text={text} resetTimeout={5000} onCopy={this.onCopy}>
              {() => (
                <Button theme="pseudo" tone="default" view="default" size="m">
                  {i18n('copy')}
                </Button>
              )}
            </CopyToClipboard>
            <Button theme="pseudo" tone="default" view="default" size="m" onClick={this.onClose}>
              {i18n('close')}
            </Button>
          </div>
        </div>
      </Modal>,
      this.anchorRef.current,
    );
  };

  render() {
    return (
      <React.Fragment>
        <Button theme="pseudo" tone="default" view="default" size="m" cls={b('button')} onClick={this.onClick}>
          {i18n('more')}
        </Button>
        <div ref={this.anchorRef} />
      </React.Fragment>
    );
  }
}

export default More;
