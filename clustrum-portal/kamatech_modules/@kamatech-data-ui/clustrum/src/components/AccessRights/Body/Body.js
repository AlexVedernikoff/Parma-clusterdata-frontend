import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Loader } from '@kamatech-data-ui/common/src';
import SectionParticipants from './SectionParticipants/SectionParticipants';
import SectionRequests from './SectionRequests/SectionRequests';
import ActionPanel from './ActionPanel/ActionPanel';
import Utils from '../../../utils';
import { STATUS, i18n } from '../constants';
import { Button } from 'lego-on-react';

// import './Body.scss';

const b = block('dl-ar-body-content');

class AccessRightsBodyContent extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
    entry: PropTypes.object,
  };

  static defaultProps = {};

  state = {
    status: STATUS.LOADING,
    editable: false,
    participants: [],
    pendingParticipants: [],
  };

  componentDidMount() {
    this.getPermissions();
  }

  componentWillUnmount() {
    this._isUnmounted = true;
  }

  async getPermissions() {
    const { entry, sdk } = this.props;
    this.setState({ status: STATUS.LOADING });
    try {
      const data = await sdk.getPermissions({ entryId: entry.entryId });
      if (this._isUnmounted) {
        return;
      }
      const { permissions, pendingPermissions, editable } = data;
      this.setState({
        participants: Utils.formParticipants({ permissions }),
        pendingParticipants: Utils.formParticipants({ permissions: pendingPermissions }),
        editable,
        status: STATUS.SUCCESS,
      });
    } catch (error) {
      if (this._isUnmounted) {
        return;
      }
      const { response: { status: errorCode } = {} } = error;
      let status = STATUS.FAIL;
      if (errorCode === 404) {
        status = STATUS.NOT_FOUND;
      }
      this.setState({ status });
    }
  }

  sectionRequests() {
    return (
      <SectionRequests
        editable={this.state.editable}
        pendingParticipants={this.state.pendingParticipants}
        sdk={this.props.sdk}
        entry={this.props.entry}
        refresh={this.refresh}
      />
    );
  }

  sectionParticipants() {
    return (
      <SectionParticipants
        editable={this.state.editable}
        participants={this.state.participants}
        sdk={this.props.sdk}
        entry={this.props.entry}
        refresh={this.refresh}
      />
    );
  }

  section(title, children) {
    return (
      <div className={b('section')}>
        <div className={b('section-title')}>{title}</div>
        {children}
      </div>
    );
  }

  renderActionPanel() {
    return (
      <ActionPanel
        sdk={this.props.sdk}
        entry={this.props.entry}
        disabled={this.state.status !== STATUS.SUCCESS}
        editable={this.state.editable}
        refresh={this.refresh}
      />
    );
  }

  renderBody() {
    return (
      <div className={b()}>
        {this.renderActionPanel()}
        {this.state.pendingParticipants.length !== 0 && this.section(i18n('section_requests'), this.sectionRequests())}
        {this.state.participants.length !== 0 && this.section(i18n('section_participants'), this.sectionParticipants())}
      </div>
    );
  }

  renderError() {
    const isFail = this.state.status === STATUS.FAIL;
    const text = isFail ? i18n('label_error-general') : i18n('label_error-not-found-entry');
    return (
      <div className={b()}>
        {isFail && this.renderActionPanel()}
        <div className={b('error')}>
          <span className={b('error-text')}>{text}</span>
          <br />
          {isFail && (
            <Button theme="action" size="m" view="default" tone="default" onClick={this.refresh}>
              {i18n('button_repeat')}
            </Button>
          )}
        </div>
      </div>
    );
  }

  refresh = () => {
    this.getPermissions();
  };

  renderLoader() {
    return (
      <div className={b()}>
        {this.renderActionPanel()}
        <div className={b('loader')}>
          <Loader size="m" />
        </div>
      </div>
    );
  }

  render() {
    switch (this.state.status) {
      case STATUS.SUCCESS:
        return this.renderBody();
      case STATUS.LOADING:
        return this.renderLoader();
      default:
        return this.renderError();
    }
  }
}

export default AccessRightsBodyContent;
