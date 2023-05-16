import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import Utils from '../../../../utils';
import User from '../../User/User';
import DialogRevokeRights from '../../Body/DialogRevokeRights/DialogRevokeRights';
import { STATUS } from '../../constants';
import { Button } from 'lego-on-react';
import { Loader } from '@kamatech-data-ui/common/src';
import isEmpty from 'lodash/isEmpty';
import ButtonDelete from '../../ButtonDelete/ButtonDelete';

// import './SectionPreviousRequests.scss';

const b = block('dl-ar-section-prev-requests');

class SectionPreviousRequests extends React.PureComponent {
  state = {
    status: STATUS.FAIL,
    currentParticipantIndex: null,
    dialogVisible: false,
    participants: [],
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
      const { pendingPermissions } = data;
      this.setState({
        participants: Utils.formParticipants({ permissions: pendingPermissions }),
        status: STATUS.SUCCESS,
      });
    } catch (error) {
      if (this._isUnmounted) {
        return;
      }
      this.setState({ status: STATUS.FAIL });
    }
  }

  onClick(index) {
    this.setState({ dialogVisible: true, currentParticipantIndex: index });
  }

  onCloseDialog = () => this.setState({ dialogVisible: false, currentParticipantIndex: null });

  onSuccessDialog = () => {
    this.setState({ dialogVisible: false, currentParticipantIndex: null }, () => {
      this.props.onChange();
      this.refresh();
    });
  };

  renderParticipants() {
    const { participants } = this.state;
    return (
      <React.Fragment>
        {participants.map((participant, index) => {
          const { permission } = participant;

          return (
            <div key={index} className={b('participant')}>
              <div className={b('user')}>
                <User showIcon participant={participant} />
              </div>
              <div className={b('permission')}>{Utils.getTextByPermission(permission)}</div>
              <ButtonDelete
                className={b('btn-delete')}
                disabled={this.props.inactive}
                onClick={() =>
                  this.setState({
                    currentParticipantIndex: index,
                    dialogVisible: true,
                  })
                }
              />
            </div>
          );
        })}
      </React.Fragment>
    );
  }

  renderSection() {
    const { currentParticipantIndex } = this.state;
    const { participants } = this.state;

    return (
      <React.Fragment>
        <div className={b()}>
          <div className={b('title')}>Предыдущие запросы</div>
          {isEmpty(participants) ? <div>Отсутствуют</div> : this.renderParticipants()}
        </div>
        {currentParticipantIndex !== null && (
          <DialogRevokeRights
            sdk={this.props.sdk}
            entry={this.props.entry}
            onClose={this.onCloseDialog}
            onSuccess={this.onSuccessDialog}
            visible={this.state.dialogVisible}
            participant={participants[currentParticipantIndex]}
          />
        )}
      </React.Fragment>
    );
  }

  renderError() {
    return (
      <div className={b()}>
        <div className={b('error')}>
          <span className={b('error-text')}>Не удалось загрузить предыдущие запросы.</span>
          <br />
          <Button
            theme="action"
            size="m"
            view="default"
            tone="default"
            onClick={this.refresh}
            disabled={this.props.inactive}
          >
            Повторить
          </Button>
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
        <div className={b('loader')}>
          <Loader size="m" />
        </div>
      </div>
    );
  }

  render() {
    switch (this.state.status) {
      case STATUS.SUCCESS:
        return this.renderSection();
      case STATUS.LOADING:
        return this.renderLoader();
      default:
        return this.renderError();
    }
  }
}

SectionPreviousRequests.propTypes = {
  sdk: PropTypes.object.isRequired,
  entry: PropTypes.object,
  onChange: PropTypes.func,
  inactive: PropTypes.bool,
};

export default SectionPreviousRequests;
