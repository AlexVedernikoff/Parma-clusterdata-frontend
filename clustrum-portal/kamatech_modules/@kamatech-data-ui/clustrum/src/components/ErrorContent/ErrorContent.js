import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Button } from 'lego-on-react';

import CloudFolderSelect from '../Header/CloudFolderSelect/CloudFolderSelect';
import EntryDialogues from '../EntryDialogues/EntryDialogues';

// import './ErrorContent.scss';

import noAccessImg from 'assets/images/clouds/403.svg';
import notFoundImg from 'assets/images/clouds/404.svg';
import errorImg from 'assets/images/clouds/500.svg';
import promoImg from 'assets/images/clouds/promo.svg';
import identityImg from 'assets/images/clouds/identity.svg';

const b = block('error-content');
const IMAGE_SIZE = 230;
export const Types = {
  LICENSE_NOT_ACCEPTED: 'license-not-accepted',
  NOT_FOUND: 'not-found',
  NOT_FOUND_CURRENT_CLOUD_FOLDER: 'not-found-current-cloud-folder',
  INACCESSIBLE_ENTRY_FOLDER: 'inaccessible-entry-folder',
  CLOUD_FOLDER_ACCESS_DENIED: 'cloud-folder-access-denied',
  NO_ACCESS: 'no-access',
  NO_ENTRY_ACCESS: 'no-entry-access',
  ERROR: 'error',
  PROMO: 'promo',
  CREDENTIALS: 'credentials',
  AUTH_FAILED: 'auth-failed',
  AUTH_DENIED: 'auth-denied',
};

const TypesWithCloudFolderSelect = [
  Types.NOT_FOUND_CURRENT_CLOUD_FOLDER,
  Types.INACCESSIBLE_ENTRY_FOLDER,
  Types.CLOUD_FOLDER_ACCESS_DENIED,
];

export const TypesHeaderWithoutCloudFolderSelect = [
  Types.NOT_FOUND_CURRENT_CLOUD_FOLDER,
  Types.INACCESSIBLE_ENTRY_FOLDER,
  Types.CLOUD_FOLDER_ACCESS_DENIED,
  Types.LICENSE_NOT_ACCEPTED,
  Types.AUTH_FAILED,
  Types.AUTH_DENIED,
];

class ErrorContent extends PureComponent {
  static defaultProps = {
    type: Types.ERROR,
  };

  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.oneOf(Object.values(Types)),
    action: PropTypes.shape({
      text: PropTypes.string,
      content: PropTypes.node,
      handler: PropTypes.func,
    }),
    reqId: PropTypes.string,
    sdk: PropTypes.object.isRequired,
    entryId: PropTypes.string,
  };

  static getDerivedStateFromProps(props) {
    const { type } = props;
    if (type === Types.LICENSE_NOT_ACCEPTED) {
      return {
        showButtonConsole: true,
      };
    }
    return null;
  }

  state = {
    showAccessRightsDialog: false,
    showButtonConsole: false,
  };

  reqIdRef = React.createRef();

  getImageSrc() {
    const { type } = this.props;

    switch (type) {
      case Types.NOT_FOUND:
      case Types.NOT_FOUND_CURRENT_CLOUD_FOLDER:
        return notFoundImg;
      case Types.NO_ACCESS:
      case Types.CLOUD_FOLDER_ACCESS_DENIED:
      case Types.INACCESSIBLE_ENTRY_FOLDER:
      case Types.NO_ENTRY_ACCESS:
      case Types.AUTH_DENIED:
        return noAccessImg;
      case Types.ERROR:
      case Types.AUTH_FAILED:
        return errorImg;
      case Types.PROMO:
      case Types.LICENSE_NOT_ACCEPTED:
        return promoImg;
      case Types.CREDENTIALS:
        return identityImg;
      default:
        return null;
    }
  }

  copyReqId = () => {
    const reqId = this.reqIdRef.current.innerHTML;

    const reqIdField = document.createElement('textarea');

    reqIdField.innerText = reqId;
    document.body.appendChild(reqIdField);
    reqIdField.select();
    document.execCommand('copy');
    reqIdField.remove();
  };

  renderTitle() {
    const { title } = this.props;

    if (!title) {
      return null;
    }

    return <div className={b('title')}>{title}</div>;
  }

  renderDescription() {
    const { description } = this.props;

    if (!description) {
      return null;
    }

    return <div className={b('description')}>{description}</div>;
  }

  renderReqId() {
    const { reqId } = this.props;

    if (!reqId) {
      return null;
    }

    return (
      <div className={b('req-id')}>
        <span ref={this.reqIdRef}>{reqId}</span>
        <Button
          cls={b('copy-req-id-btn')}
          theme="light"
          size="n"
          view="default"
          tone="default"
          text="Копировать"
          onClick={this.copyReqId}
        />
      </div>
    );
  }

  renderAction() {
    if (this.state.showButtonConsole) {
      return (
        <Button
          cls={b('action-btn')}
          theme="action"
          size="s"
          view="default"
          tone="default"
          text="Перейти в консоль"
          onClick={() => window.location.assign(window.DL.endpoints.console)}
        />
      );
    }
    return null;
  }

  renderPropsAction() {
    const { action } = this.props;

    if (!action) {
      return null;
    }

    const { text, content, handler } = action;

    return (
      content || (
        <Button
          cls={b('action-btn')}
          theme="action"
          size="s"
          view="default"
          tone="default"
          text={text}
          onClick={handler}
        />
      )
    );
  }

  renderCloudFolderSelect() {
    if (TypesWithCloudFolderSelect.includes(this.props.type)) {
      return (
        <div className={b('cloud-folder-select')}>
          <CloudFolderSelect sdk={this.props.sdk} onNotify={this.onNotifyCloudFolderSelect} />
        </div>
      );
    }
    return null;
  }

  onNotifyCloudFolderSelect = notification => {
    if (notification === 'empty') {
      this.setState({ showButtonConsole: true });
    }
  };

  renderUnlock() {
    const { entryId, type, sdk } = this.props;

    if (type === Types.NO_ENTRY_ACCESS && entryId) {
      const DialogUnlock = EntryDialogues.dialogs.unlock;

      return (
        <React.Fragment>
          <Button
            cls={b('action-btn')}
            theme="action"
            view="default"
            tone="default"
            size="n"
            onClick={() => this.setState({ showAccessRightsDialog: true })}
          >
            Запросить права
          </Button>
          <DialogUnlock
            sdk={sdk}
            onClose={() => this.setState({ showAccessRightsDialog: false })}
            visible={this.state.showAccessRightsDialog}
            dialogProps={{ entry: { entryId } }}
          />
        </React.Fragment>
      );
    }

    return null;
  }

  renderImage() {
    const src = this.getImageSrc();

    return <img width={IMAGE_SIZE} height={IMAGE_SIZE} src={src} />;
  }

  renderErrorContent() {
    const { title, description, action } = this.props;

    if (!title && !description && !action) {
      return null;
    }

    return (
      <div className={b('content')}>
        {this.renderTitle()}
        {this.renderDescription()}
        {this.renderCloudFolderSelect()}
        {this.renderUnlock()}
        {this.renderAction()}
        {this.renderPropsAction()}
        {this.renderReqId()}
      </div>
    );
  }

  render() {
    return (
      <div className={b()}>
        <div className={b('image')}>{this.renderImage()}</div>
        {this.renderErrorContent()}
      </div>
    );
  }
}

export default ErrorContent;
