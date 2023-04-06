import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Button, Icon, Link, Modal } from 'lego-on-react';

import CopyToClipboard from '@kamatech-data-ui/react-components/src/components/CopyToClipboard';

import { i18nV2 as i18nFactory } from '../../../modules/i18n/i18n';
import settings from '../../../modules/settings/settings';

import * as keyset from '../i18n';

// import '../Error.scss';

const i18n = i18nFactory(keyset);
const b = block('chartkit-error');

class Sources extends React.PureComponent {
  static propTypes = {
    isEditMode: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    requestId: PropTypes.string.isRequired,
    retryClick: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      data: {
        error: { extra = {} },
      },
    } = this.props;

    const { sources = {} } = extra;

    console.error(sources);
  }

  get sourcesLines() {
    const { extra = {} } = this.props.data.error;

    const { sources = {} } = extra;

    const sourcesByTypes = Object.keys(sources).reduce((result, key) => {
      const { sourceType, body } = sources[key];
      result[sourceType] = result[sourceType] || [];
      result[sourceType].push({ key, body });
      return result;
    }, {});

    return Object.keys(sourcesByTypes).reduce((result, key) => {
      const typedSources = sourcesByTypes[key];
      const sourceName = settings.config[key] ? settings.config[key].description.title : key;
      if (typedSources.length > 1) {
        result.push({
          title: sourceName,
          key,
          body: typedSources.reduce((result, { key, body }) => ({ ...result, [key]: body }), {}),
        });
      } else {
        result.push({ title: sourceName, ...typedSources[0] });
      }
      return result;
    }, []);
  }

  anchorRef = React.createRef();

  onClose = () => ReactDOM.unmountComponentAtNode(this.anchorRef.current);

  onSourceClick(body) {
    const text = `${this.props.requestId}

${JSON.stringify(body, null, 4)}`;

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
  }

  renderExtra() {
    if (this.sourcesLines.length > 1) {
      return (
        <ul className={b('extra')}>
          {this.sourcesLines.map(({ title, key, body }) => (
            <li className={b('extra-line')} onClick={() => this.onSourceClick(body)} key={key}>
              {title}
            </li>
          ))}
        </ul>
      );
    }

    if (this.props.isEditMode) {
      return <div className={b('code')}>{JSON.stringify(this.sourcesLines[0].body, null, 4)}</div>;
    }

    return null;
  }

  render() {
    const { isEditMode, retryClick, requestId } = this.props;
    return (
      <React.Fragment>
        <div className={b()}>
          <div className={b('title')}>{i18n('error-data-fetching')}</div>
          {this.renderExtra()}
          <div className={b('retry')}>
            <Button
              theme="action"
              tone="default"
              view="default"
              size="m"
              cls={b('button')}
              onClick={() => retryClick()}
            >
              {i18n('retry')}
            </Button>
            {!isEditMode && this.sourcesLines.length === 1 && (
              <Button
                theme="pseudo"
                tone="default"
                view="default"
                size="m"
                cls={b('button')}
                onClick={() => this.onSourceClick(this.sourcesLines[0].body)}
              >
                {i18n('more')}
              </Button>
            )}
          </div>
          {requestId && <div className={b('request-id')}>{requestId}</div>}
        </div>
        <div ref={this.anchorRef} />
      </React.Fragment>
    );
  }
}

export default Sources;
